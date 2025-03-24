import { logger } from "../logger/logger.js";
import { isTokenValid, isTokenWithinValidTime, parseCognitoToken } from "./auth.js";
export const createAuthMiddleware = (requiredGroups, awsRegion, poolID, cookieName) => {
    return async (req, res, next) => {
        let token = req.headers.authorization;
        if (cookieName && !token) {
            token = req.cookies[cookieName];
        }
        if (!token) {
            logger.error("No auth token provided");
            res.status(401).send({ error: 'No auth token provided' });
            return;
        }
        try {
            const decodedToken = await parseCognitoToken(token, awsRegion, poolID);
            if (requiredGroups?.length && !isTokenValid(decodedToken, requiredGroups)) {
                res.status(401).send({ error: 'Invalid token' });
                return;
            }
            if (!isTokenWithinValidTime(decodedToken)) {
                res.status(401).send({ error: 'Token expired' });
                return;
            }
            res.locals.decodedToken = decodedToken;
            next();
        }
        catch (error) {
            logger.error(`Authentication error: ${error.message}`);
            res.status(401).send({ error: `Authentication error` });
        }
    };
};
export const createOptionalAuthMiddleware = (requiredGroups, awsRegion, poolID, cookieName) => {
    return async (req, res, next) => {
        let token = req.headers.authorization;
        if (cookieName && !token)
            token = req.cookies[cookieName];
        if (!token) {
            return next();
        }
        try {
            const decodedToken = await parseCognitoToken(token, awsRegion, poolID);
            if (requiredGroups?.length && !isTokenValid(decodedToken, requiredGroups) || !isTokenWithinValidTime(decodedToken)) {
                return next();
            }
            res.locals.decodedToken = decodedToken;
            next();
        }
        catch (error) {
            next();
        }
    };
};
