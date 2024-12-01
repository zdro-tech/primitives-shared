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
export const createJwtPayload = (sub, issuer, expirationInSeconds = 3601) => {
    return {
        sub,
        iss: issuer,
        exp: Math.floor(Date.now() / 1000) + expirationInSeconds
    };
};
export const createJwtHeader = (kid, algorithm = 'RS256', type = 'JWT') => {
    return {
        alg: algorithm,
        typ: type,
        kid
    };
};
export const generateSignedToken = async (payload, keyName, header) => {
    return await signPayload(payload, keyName, header);
};
export const getFullKeyName = (projectID, keyRing) => {
    return `projects/${projectID}/locations/global/keyRings/${keyRing}`;
};
export const generateAuthToken = async (doctorId, jwtIssuer, jwtHeaderKid, privateKeyPath, projectId, tokenLifetime = 3600) => {
    const payload = createJwtPayload(doctorId, jwtIssuer, tokenLifetime);
    const header = createJwtHeader(jwtHeaderKid, "RS256", "JWT");
    const keyName = getFullKeyName(projectId, privateKeyPath);
    return await generateSignedToken(payload, keyName, header);
};
