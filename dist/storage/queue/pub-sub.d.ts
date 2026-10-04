import { PubSub } from '@google-cloud/pubsub';
export declare const publish: (topicName: string, payload: any, fallbackURL: string, orderingKey?: string, client?: PubSub) => Promise<void>;
export declare const publishToMultipleDestinations: (topicName: string, payload: any, fallbackURLs: Array<string>, orderingKey?: string, client?: PubSub) => Promise<void>;
export declare const parsePubSubMessage: (payload: string) => any;
export interface ProcessedMessagesStore {
    set(key: string, value: string, options: {
        NX?: true;
        EX: number;
    }): Promise<string | null>;
    get(key: string): Promise<string | null>;
    del(key: string): Promise<unknown>;
    expire(key: string, seconds: number): Promise<unknown>;
}
export interface PubSubDedupeOptions {
    store: ProcessedMessagesStore;
    subscription: string;
    leaseSeconds?: number;
    processedTtlSeconds?: number;
}
export declare class PubSubMessageInProgressError extends Error {
    constructor(messageId: string);
}
export declare const processPubSubMessage: (messageData: any, processFunction: (data: any) => Promise<any>, dedupe?: PubSubDedupeOptions) => Promise<any>;
//# sourceMappingURL=pub-sub.d.ts.map