import { KeyManagementServiceClient } from '@google-cloud/kms';
export declare const getKmsClient: (kmsOptions?: {}) => KeyManagementServiceClient;
export declare const signPayload: (payload: object, keyName: string, header?: {
    alg: string;
    typ: string;
    kid: string;
}) => Promise<string>;
//# sourceMappingURL=signatures.d.ts.map