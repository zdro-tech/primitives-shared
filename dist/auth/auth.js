import axios from "axios";
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
const base64UrlDecode = (input) => {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    return Buffer.from(base64, 'base64').toString('utf-8');
};
export const decodeJwt = (token) => {
    const segments = token.split('.');
    if (segments.length !== 3) {
        return {};
    }
    const payload = segments[1];
    const decodedPayload = base64UrlDecode(payload);
    return JSON.parse(decodedPayload);
};
export const parseCognitoToken = async (token, awsRegion, poolID) => {
    if (!awsRegion || !poolID) {
        throw new Error('AWS_REGION or Cognito USER_POOL_ID are empty');
    }
    const jks = await getJwks(awsRegion, poolID);
    return await parseToken(token, jks);
};
export const parseToken = async (token, jwks) => {
    if (!token) {
        throw new Error('Token is empty');
    }
    if (token.startsWith('Bearer ')) {
        token = token.replace('Bearer ', '');
    }
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || typeof decoded === 'string' || !decoded.header.kid) {
        throw new Error('Token cannot be decoded or header KID is missing');
    }
    const jwk = jwks.find((key) => key.kid === decoded.header.kid);
    if (!jwk) {
        throw new Error('JWK not found for token');
    }
    const pem = jwkToPem(jwk);
    return jwt.verify(token, pem, { algorithms: ['RS256'] });
};
export const getJwks = async (awsRegion, userPoolID) => {
    try {
        const uri = `https://cognito-idp.${awsRegion}.amazonaws.com/${userPoolID}/.well-known/jwks.json`;
        const response = await axios.get(uri);
        return response.data.keys;
    }
    catch (error) {
        console.error('Error fetching JWKs:', error);
        throw new Error('Error fetching JWKs');
    }
};
export const isTokenValid = (accessToken, groups, extendExpiration = 24 * 60 * 60) => {
    return isTokenWithinValidTime(accessToken, extendExpiration) && checkCognitoGroups(accessToken, groups);
};
export const checkCognitoGroups = (accessToken, requiredGroups) => {
    const tokenGroups = accessToken['cognito:groups'] || [];
    return requiredGroups.every((group) => tokenGroups.includes(group));
};
export const isTokenWithinValidTime = (decodedToken, extendExpiration = 24 * 60 * 60) => {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    return !!decodedToken.exp && currentTimeInSeconds < decodedToken.exp + extendExpiration;
};
