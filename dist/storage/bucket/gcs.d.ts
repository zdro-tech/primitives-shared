import { Storage, Bucket } from "@google-cloud/storage";
import { FileData } from "../../types/chat-message.js";
export declare const fileStorage: Storage;
export declare const chatFilesBucket: Bucket;
export declare const saveBase64File: (fileData: FileData) => Promise<unknown>;
export declare const getFileLink: (bucketFileName: string) => Promise<string>;
//# sourceMappingURL=gcs.d.ts.map