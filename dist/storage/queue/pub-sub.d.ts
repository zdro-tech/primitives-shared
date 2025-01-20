import { PubSub } from '@google-cloud/pubsub';
export declare const publish: (topicName: string, payload: any, fallbackURL: string, orderingKey?: string, client?: PubSub) => Promise<void>;
export declare const publishToMultipleDestinations: (topicName: string, payload: any, fallbackURLs: Array<string>, orderingKey?: string, client?: PubSub) => Promise<void>;
export declare const parsePubSubMessage: (payload: string) => any;
export declare const processPubSubMessage: (messageData: any, processFunction: (data: any) => Promise<any>) => Promise<any>;
//# sourceMappingURL=pub-sub.d.ts.map