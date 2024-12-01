import { KeyManagementServiceClient } from '@google-cloud/kms';
export declare const getKmsClient: (kmsOptions?: {}) => KeyManagementServiceClient;
export declare const signPayload: (payload: object, keyName: string, header?: {
    alg: string;
    typ: string;
    kid: string;
}) => Promise<string>;
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
export declare const createJwtPayload: (sub: string, issuer: string, expirationInSeconds?: number) => JwtPayload;
export declare const createJwtHeader: (kid: string, algorithm?: string, type?: string) => JwtHeader;
export declare const generateSignedToken: (payload: JwtPayload, keyName: string, header: JwtHeader) => Promise<string>;
export declare const getFullKeyName: (projectID: string, keyRing: string) => string;
export declare const generateAuthToken: (doctorId: string, jwtIssuer: string, jwtHeaderKid: string, privateKeyPath: string, projectId: string, tokenLifetime?: number) => Promise<string>;
//# sourceMappingURL=signatures.d.ts.map