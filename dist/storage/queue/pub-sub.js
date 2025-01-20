import { PubSub } from '@google-cloud/pubsub';
import axios from 'axios';
import { logger } from '../../logger/logger.js';
let pubSubClient = null;
const initPubSubClient = () => {
    if (pubSubClient) {
        return pubSubClient;
    }
    if (!process.env.PROJECT_ID) {
        throw new Error('PROJECT_ID environment variable is not defined, but required for pub/sub.');
    }
    pubSubClient = new PubSub({ projectId: process.env.PROJECT_ID });
    return pubSubClient;
};
export const publish = async (topicName, payload, fallbackURL, orderingKey, client) => {
    const fullTopicName = `projects/${process.env.PROJECT_ID}/topics/${topicName}`;
    logger.debug(`Publishing to topic ${fullTopicName} with payload ${JSON.stringify(payload)} and fallback URL ${fallbackURL}`);
    if (!client) {
        client = initPubSubClient();
    }
    if (process.env.NODE_ENV === 'production') {
        try {
            const message = { data: Buffer.from(JSON.stringify(payload)) };
            if (orderingKey) {
                message.orderingKey = orderingKey;
            }
            await client.topic(fullTopicName, { enableOpenTelemetryTracing: true })
                .publishMessage(message);
            return;
        }
        catch (e) {
            logger.debug(`Error while delivering message to the ${fullTopicName}`, e);
            throw e;
        }
    }
    try {
        await axios.post(fallbackURL, { "message": { "data": payload } });
    }
    catch (e) {
        logger.debug(`Error while delivering message to the fallback URL ${fallbackURL}`, e);
    }
};
export const publishToMultipleDestinations = async (topicName, payload, fallbackURLs, orderingKey, client) => {
    if (process.env.NODE_ENV === 'production') {
        return await publish(topicName, payload, "", orderingKey, client);
    }
    for (const url of fallbackURLs) {
        publish(topicName, payload, url)
            .catch((e) => {
            logger.debug(`Error while delivering message to the ${url}`, e);
        });
    }
};
export const parsePubSubMessage = (payload) => {
    payload = payload ?? '';
    if (process.env.NODE_ENV == 'production') {
        return JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
    }
    return payload;
};
export const processPubSubMessage = async (messageData, processFunction) => {
    if (!messageData || !messageData.data) {
        throw new Error('Invalid Pub/Sub message format.');
    }
    const parsedData = parsePubSubMessage(messageData.data);
    return await processFunction(parsedData);
};
