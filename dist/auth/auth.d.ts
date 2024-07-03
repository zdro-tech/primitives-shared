export declare const decodeJwt: (token: string) => any;
export declare const parseCognitoToken: (token: string, awsRegion: string, poolID: string) => Promise<AccessToken>;
export declare const parseToken: (token: string, jwks: any) => Promise<AccessToken>;
export declare const getJwks: (awsRegion: string, userPoolID: string) => Promise<any>;
export declare const isTokenValid: (accessToken: AccessToken, groups: string[], extendExpiration?: number) => boolean;
export declare const checkCognitoGroups: (accessToken: AccessToken, requiredGroups: string[]) => boolean;
export declare const isTokenWithinValidTime: (decodedToken: AccessToken, extendExpiration?: number) => boolean;
export interface CommonTokenFields {
    sub: string;
    "cognito:groups"?: string[];
    iss: string;
    origin_jti: string;
    event_id: string;
    token_use: 'access' | 'id';
    auth_time: number;
    exp: number;
    iat: number;
    jti: string;
}
export interface IDToken extends CommonTokenFields {
    token_use: 'id';
    "cognito:username": string;
    email_verified: boolean;
    email: string;
}
export interface AccessToken extends CommonTokenFields {
    token_use: 'access';
    client_id: string;
    scope: string;
    username?: string;
}
//# sourceMappingURL=auth.d.ts.map