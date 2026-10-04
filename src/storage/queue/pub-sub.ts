import { randomUUID } from 'node:crypto';
import { PubSub } from '@google-cloud/pubsub';
import axios from 'axios';
import { logger } from '../../logger/logger.js';
import { MessageOptions } from '@google-cloud/pubsub/build/src/topic.js';

let pubSubClient: PubSub | null = null;

const initPubSubClient = (): PubSub => {
    if (pubSubClient) {
        return pubSubClient;
    }
    if (!process.env.PROJECT_ID) {
        throw new Error('PROJECT_ID environment variable is not defined, but required for pub/sub.');
    }
    pubSubClient = new PubSub({ projectId: process.env.PROJECT_ID, enableOpenTelemetryTracing: true });
    return pubSubClient;
};


export const publish = async (
    topicName: string,
    payload: any,
    fallbackURL: string,
    orderingKey?: string,
    client?: PubSub,
): Promise<void> => {
    const fullTopicName = `projects/${process.env.PROJECT_ID}/topics/${topicName}`;
    logger.debug(`Publishing to topic ${fullTopicName} with payload ${JSON.stringify(payload)} and fallback URL ${fallbackURL}`);
    if (!client) {
        client = initPubSubClient()
    }

    if (process.env.NODE_ENV === 'production') {
        try {
            const message: MessageOptions = { data: Buffer.from(JSON.stringify(payload)) }
            if (orderingKey) {
                message.orderingKey = orderingKey
            }
            await client.topic(fullTopicName)
                .publishMessage(message);
            return;
        } catch (e) {
            logger.debug(`Error while delivering message to the ${fullTopicName}`, e);
            throw e;
        }
    }
    try {
        await axios.post(fallbackURL, { "message": { "data": payload } });
    } catch (e) {
        logger.debug(`Error while delivering message to the fallback URL ${fallbackURL}`, e);
    }
}

export const publishToMultipleDestinations = async (
    topicName: string,
    payload: any,
    fallbackURLs: Array<string>,
    orderingKey?: string,
    client?: PubSub
): Promise<void> => {

    if (process.env.NODE_ENV === 'production') {
        return await publish(topicName, payload, "", orderingKey, client);
    }

    for (const url of fallbackURLs) {
        publish(topicName, payload, url)
            .catch((e) => {
                logger.debug(`Error while delivering message to the ${url}`, e);
            });
    }
}

export const parsePubSubMessage = (payload: string): any => {
    payload = payload ?? '';
    if (process.env.NODE_ENV == 'production') {
        return JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
    }
    return payload;
};

export interface ProcessedMessagesStore {
    set(key: string, value: string, options: { NX?: true, EX: number }): Promise<string | null>;
    get(key: string): Promise<string | null>;
    del(key: string): Promise<unknown>;
    expire(key: string, seconds: number): Promise<unknown>;
}

export interface PubSubDedupeOptions {
    store: ProcessedMessagesStore;
    // Message ids are only unique per topic and every subscription gets its own copy, so the key is scoped by subscription.
    subscription: string;
    // Renewed while the handler runs, so it only bounds how long a crashed delivery blocks its redelivery.
    leaseSeconds?: number;
    // Must outlive the subscription's message retention, otherwise a late redelivery is processed again.
    processedTtlSeconds?: number;
}

export class PubSubMessageInProgressError extends Error {
    constructor(messageId: string) {
        super(`Pub/Sub message ${messageId} is being processed by another delivery`);
        this.name = 'PubSubMessageInProgressError';
    }
}

const PROCESSED = 'processed';
const DEFAULT_LEASE_SECONDS = 60;
const DEFAULT_PROCESSED_TTL_SECONDS = 8 * 24 * 60 * 60;

export const processPubSubMessage = async (
    messageData: any,
    processFunction: (data: any) => Promise<any>,
    dedupe?: PubSubDedupeOptions
) => {
    if (!messageData || !messageData.data) {
        throw new Error('Invalid Pub/Sub message format.');
    }
    const parsedData = parsePubSubMessage(messageData.data);
    const messageId = messageData.messageId ?? messageData.message_id;
    if (!dedupe?.store || !dedupe.subscription || !messageId) {
        return await processFunction(parsedData);
    }

    const key = `pubsub:processed:${dedupe.subscription}:${messageId}`;
    const lease = `processing:${randomUUID()}`;
    const leaseSeconds = dedupe.leaseSeconds ?? DEFAULT_LEASE_SECONDS;
    let claimed: boolean;
    try {
        claimed = (await dedupe.store.set(key, lease, { NX: true, EX: leaseSeconds })) !== null;
        if (!claimed && (await dedupe.store.get(key)) === PROCESSED) {
            logger.warn(`Skipping already processed Pub/Sub message ${messageId} on ${dedupe.subscription}`);
            return;
        }
    } catch (e) {
        logger.warn(`Pub/Sub dedupe is unavailable, processing message ${messageId} without it`, e);
        return await processFunction(parsedData);
    }
    // Not acknowledged on purpose: if the other delivery fails, this message still has to be retried.
    if (!claimed) {
        throw new PubSubMessageInProgressError(messageId);
    }

    let renewal: Promise<void> = Promise.resolve();
    const renewLease = async () => {
        try {
            if ((await dedupe.store.get(key)) === lease) {
                await dedupe.store.expire(key, leaseSeconds);
            }
        } catch (e) {
            logger.warn(`Could not renew the lease of Pub/Sub message ${messageId}`, e);
        }
    };
    const renewalTimer = setInterval(() => { renewal = renewLease(); }, leaseSeconds * 1000 / 3);
    // A renewal still in flight would otherwise overwrite the final state of the key.
    const stopRenewal = async () => {
        clearInterval(renewalTimer);
        await renewal;
    };
    let result;
    try {
        result = await processFunction(parsedData);
    } catch (e) {
        await stopRenewal();
        try {
            if ((await dedupe.store.get(key)) === lease) {
                await dedupe.store.del(key);
            }
        } catch (releaseError) {
            logger.warn(`Could not release Pub/Sub message ${messageId}, it stays locked until the lease expires`, releaseError);
        }
        throw e;
    }
    await stopRenewal();
    try {
        await dedupe.store.set(key, PROCESSED, { EX: dedupe.processedTtlSeconds ?? DEFAULT_PROCESSED_TTL_SECONDS });
    } catch (e) {
        logger.warn(`Could not mark Pub/Sub message ${messageId} as processed, a redelivery will be processed again`, e);
    }
    return result;
};
