import { logger } from "../logger/logger.js";
import { Request, Response, NextFunction } from 'express';
import { isTokenValid, isTokenWithinValidTime, parseCognitoToken } from "./auth.js";

export const createAuthMiddleware = (requiredGroups: string[], awsRegion: string, poolID: string): (req: Request, res: Response, next: NextFunction) => Promise<void> => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization
    if (!token) {
      logger.error("No auth token provided");
      res.status(401).send({ error: 'No auth token provided' });
      return
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
    } catch (error: any) {
      logger.error(`Authentication error: ${error.message}`);
      res.status(401).send({ error: `Authentication error` });
    }
  };
}