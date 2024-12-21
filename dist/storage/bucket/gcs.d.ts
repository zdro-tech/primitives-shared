import { Storage, File, Bucket } from "@google-cloud/storage";
import { FileData } from "../../types/chat-message.js";
export declare const getFileStorage: (projectId: string) => Storage;
export declare const getFileBucket: (storage: Storage, bucketName: string) => Bucket;
export declare const saveBase64File: (bucket: Bucket, fileData: FileData) => Promise<unknown>;
export declare const saveFileBuffer: (bucket: Bucket, fileData: FileData) => Promise<unknown>;
export declare const getFileLink: (bucket: Bucket, fileName: string, expiresInMinutes?: number) => Promise<string>;
export declare const getFile: (bucket: Bucket, fileName: string) => File;
//# sourceMappingURL=gcs.d.ts.map