import { KeyManagementServiceClient } from '@google-cloud/kms';
import crypto from 'crypto';
let kmsClientInstance = null;
export const getKmsClient = (kmsOptions = {}) => {
    if (!kmsClientInstance) {
        kmsClientInstance = new KeyManagementServiceClient(kmsOptions);
    }
    return kmsClientInstance;
};
export const signPayload = async (payload, keyName, header = { alg: 'RS256', typ: 'JWT', kid: '' }) => {
    const kmsClient = getKmsClient();
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const message = `${encodedHeader}.${encodedPayload}`;
    const hash = crypto.createHash('sha256').update(message).digest('base64');
    const [signResponse] = await kmsClient.asymmetricSign({
        name: keyName,
        digest: { sha256: hash },
    });
    const signature = Buffer.from(signResponse.signature).toString('base64url');
    return `${message}.${signature}`;
};
