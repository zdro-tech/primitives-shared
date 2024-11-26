import { KeyManagementServiceClient } from '@google-cloud/kms';
import crypto from 'crypto';

let kmsClientInstance: KeyManagementServiceClient | null = null;

export const getKmsClient = (kmsOptions = {}): KeyManagementServiceClient => {
  if (!kmsClientInstance) {
    kmsClientInstance = new KeyManagementServiceClient(kmsOptions);
  }
  return kmsClientInstance;
};

export const signPayload = async (
  payload: object,
  keyName: string,
  header = { alg: 'RS256', typ: 'JWT', kid: '' }
): Promise<string> => {
  const kmsClient = getKmsClient();
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const message = `${encodedHeader}.${encodedPayload}`;
  const hash = crypto.createHash('sha256').update(message).digest('base64');
  const [signResponse] = await kmsClient.asymmetricSign({
    name: keyName,
    digest: { sha256: hash },
  });
  const signature = Buffer.from(signResponse.signature as Uint8Array).toString('base64url');
  return `${message}.${signature}`;
};

export interface JwtPayload {
  sub: string;
  iss: string;
  exp: number;
}

export interface JwtHeader {
  alg: string;
  typ: string;
  kid: string;
}

export interface EnvVariable {
  key: string;
  message?: string;
}

export const createJwtPayload = (sub: string, issuer: string, expirationInSeconds = 3601): JwtPayload => {
  return {
      sub,
      iss: issuer,
      exp: Math.floor(Date.now() / 1000) + expirationInSeconds
  };
};

export const createJwtHeader = (kid: string, algorithm = 'RS256', type = 'JWT'): JwtHeader => {
  return {
      alg: algorithm,
      typ: type,
      kid
  };
};

export const generateSignedToken = async (payload: JwtPayload, keyName: string, header: JwtHeader): Promise<string> => {
  return await signPayload(payload, keyName, header);
};

export const getFullKeyName = (projectID: string, keyRing: string) : string => {
  return `projects/${projectID}/locations/global/keyRings/${keyRing}`;
}