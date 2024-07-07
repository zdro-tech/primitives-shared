import { Storage, Bucket } from "@google-cloud/storage";
import { FileData } from "../../types/chat-message.js";
export declare const getFileStorage: (projectId: string) => Storage;
export declare const getFileBucket: (storage: Storage, bucketName: string) => Bucket;
export declare const saveBase64File: (bucket: Bucket, fileData: FileData) => Promise<unknown>;
export declare const getFileLink: (bucket: Bucket, fileName: string) => Promise<string>;
//# sourceMappingURL=gcs.d.ts.map