import { Storage, File, GetSignedUrlConfig, Bucket } from "@google-cloud/storage";
import { FileData } from "../../types/chat-message.js";
import { logger } from "../../logger/logger.js";
import { Readable } from "stream";

export const getFileStorage = (projectId: string): Storage => {
  if (!projectId) {
    throw new Error('Project ID is empty');
  }
  logger.debug(`Initializing Storage with projectId: ${projectId}`);
  return new Storage({
    projectId: projectId
  });
}

export const getFileBucket = (storage: Storage, bucketName: string): Bucket => {
  if (!bucketName) {
    throw new Error('Bucket name is empty');
  }
  logger.debug(`Accessing bucket: ${bucketName}`);
  return storage.bucket(bucketName);
}

export const saveBase64File = async (bucket: Bucket, fileData: FileData) => {
  if (!fileData.fileData) {
    throw new Error(`No file data provided for file ${fileData.fileName}`);
  }

  logger.debug(`Starting to save file: ${fileData.fileName} to bucket: ${bucket.name}`);

  const base64String = fileData.fileData.split(',')[1];
  const buffer = Buffer.from(base64String, 'base64');
  const file = bucket.file(fileData.bucketFileName);

  const stream = file.createWriteStream({
    metadata: {
      contentType: 'auto',
      predefinedAcl: 'private',
    },
  });

  return new Promise((resolve, reject) => {
    stream.on('error', (err: Error) => {
      logger.error(`Error saving file ${fileData.fileName} to bucket ${bucket.name}`, err);
      reject(new Error(`Failed to save file ${fileData.fileName} to bucket ${bucket.name}: ${err.message}`));
    });
    stream.on('finish', () => {
      logger.debug(`Successfully saved file: ${fileData.fileName} to bucket: ${bucket.name}`);
      resolve(file.publicUrl());
    });
    stream.end(buffer);
  });
};

export const saveFileBuffer = async (bucket: Bucket, fileData: FileData) => {
  if (!fileData.fileBuffer) {
    throw new Error(`No file buffer provided for file ${fileData.fileName}`);
  }

  const file = bucket.file(fileData.bucketFileName);
  const stream = file.createWriteStream({
    metadata: { contentType: 'auto', predefinedAcl: 'private' },
  });

  return new Promise((resolve, reject) => {
    stream.on('error', reject);
    stream.on('finish', () => resolve(file.publicUrl()));
    stream.end(fileData.fileBuffer);
  });
};


export const getFileLink = async (bucket: Bucket, fileName: string, expiresInMinutes = 1): Promise<string> => {
  logger.debug(`Generating signed URL for file: ${fileName} in bucket: ${bucket.name}`);

  const options: GetSignedUrlConfig = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + expiresInMinutes * 60 * 1000, // 1 minute
  };

  try {
    const [url] = await bucket.file(fileName).getSignedUrl(options);
    logger.debug(`Generated signed URL for file: ${fileName} in bucket: ${bucket.name}`);
    return url;
  } catch (error: any) {
    logger.error(`Error generating signed URL for file ${fileName} in bucket ${bucket.name}`, error);
    throw new Error(`Failed to generate signed URL for file ${fileName} in bucket ${bucket.name}: ${error.message}`);
  }
};

export const getFile = (bucket: Bucket, fileName: string): File => {
  return bucket.file(fileName)
};

export const getFileStream = (bucket: Bucket, fileName: string): NodeJS.ReadableStream => {
  return getFile(bucket, fileName).createReadStream();
};