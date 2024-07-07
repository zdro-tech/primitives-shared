import { Storage } from "@google-cloud/storage";
export const getFileStorage = (projectId) => {
    if (!projectId) {
        throw new Error('Project ID is empty');
    }
    return new Storage({
        projectId: process.env.PROJECT_ID ?? undefined,
        keyFilename: process.env.GCP_SA_KEYFILE_LOCAL,
    });
};
export const getFileBucket = (storage, bucketName) => {
    if (!bucketName) {
        throw new Error('Bucket name is empty');
    }
    return storage.bucket(bucketName);
};
export const saveBase64File = async (bucket, fileData) => {
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
        stream.on('error', (err) => reject(err));
        stream.on('finish', () => resolve(file.publicUrl()));
        stream.end(buffer);
    });
};
export const getFileLink = async (bucket, fileName) => {
    const options = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000, // 60 minutes, but what's about server timezone?
    };
    try {
        const [url] = await bucket.file(fileName).getSignedUrl(options);
        return url;
    }
    catch (error) {
        console.error('Error generating signed URL:', error);
        throw error;
    }
};
