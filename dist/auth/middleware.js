import { logger } from "../logger/logger.js";
import { isTokenValid, isTokenWithinValidTime, parseCognitoToken } from "./auth.js";
export const createAuthMiddleware = (requiredGroups, awsRegion, poolID) => {
    return async (req, res, next) => {
        const token = req.headers.authorization;
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
                res.status(401).send({ error: 'Invalid token' });
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
