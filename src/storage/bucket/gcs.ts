import { Storage, GetSignedUrlConfig, Bucket } from "@google-cloud/storage";
import { FileData } from "../../types/chat-message.js";

export const fileStorage: Storage = new Storage({
  projectId: process.env.PROJECT_ID ?? undefined,
  keyFilename: process.env.GCP_SA_KEYFILE_LOCAL,
});

export const chatFilesBucket = fileStorage.bucket(process.env.CHAT_FILES_BUCKET ?? '');

export const saveBase64File = async (fileData: FileData) => {
  if (!fileData.fileData) {
    throw new Error(`No file data provided for file ${fileData.fileName}`);
  }

  const base64String = fileData.fileData.split(',')[1];
  const buffer = Buffer.from(base64String, 'base64');
  const file = chatFilesBucket.file(fileData.bucketFileName);

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

export const getFileLink = async (bucketFileName: string): Promise<string> => {
  const options: GetSignedUrlConfig = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 2 * 60 * 1000, // 2 minutes
  };

  try {
    const [url] = await chatFilesBucket.file(bucketFileName).getSignedUrl(options);
    return url;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw error;
  }
};
