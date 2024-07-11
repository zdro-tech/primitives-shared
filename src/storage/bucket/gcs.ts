import { Storage, GetSignedUrlConfig, Bucket } from "@google-cloud/storage";
import { FileData } from "../../types/chat-message.js";

export const getFileStorage = (projectId: string): Storage => {
  if (!projectId) {
    throw new Error('Project ID is empty');
  }
  return new Storage({
    projectId: process.env.PROJECT_ID ?? undefined,
    keyFilename: process.env.GCP_SA_KEYFILE_LOCAL,
  });
}

export const getFileBucket = (storage: Storage, bucketName: string): Bucket => {
  if (!bucketName) {
    throw new Error('Bucket name is empty');
  }
  return storage.bucket(bucketName);
}

export const saveBase64File = async (bucket: Bucket, fileData: FileData) => {
  if (!fileData.fileData) {
    throw new Error(`No file data provided for file ${fileData.fileName}`);
  }

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
    stream.on('error', (err: Error) => reject(err));
    stream.on('finish', () => resolve(file.publicUrl()));
    stream.end(buffer);
  });
};

export const getFileLink = async (bucket: Bucket, fileName: string, expiresInMinutes = 1): Promise<string> => {
  const options: GetSignedUrlConfig = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + expiresInMinutes * 60 * 1000, // 1 minute
  };

  try {
    const [url] = await bucket.file(fileName).getSignedUrl(options);
    return url;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw error;
  }
};
