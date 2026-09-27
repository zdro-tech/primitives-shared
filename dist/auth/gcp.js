import { OAuth2Client } from 'google-auth-library';
import { logger } from "../logger/logger.js";
const oauthClient = new OAuth2Client();
// Audience is not checked: push URLs differ per route and per run.app host.
export const mustBeGcpServiceAccount = (accountNames) => {
    return async (req, res, next) => {
        if (process.env.NODE_ENV !== 'production') {
            return next();
        }
        const header = req.headers.authorization;
        if (!header?.startsWith('Bearer ')) {
            logger.warn(`GCP auth: missing bearer token on ${req.method} ${req.originalUrl}`);
            res.status(401).send({ error: 'Unauthorized' });
            return;
        }
        let payload;
        try {
            const ticket = await oauthClient.verifyIdToken({ idToken: header.slice('Bearer '.length) });
            payload = ticket.getPayload();
        }
        catch (error) {
            logger.warn(`GCP auth: invalid token on ${req.method} ${req.originalUrl}: ${error.message}`);
            res.status(401).send({ error: 'Unauthorized' });
            return;
        }
        const allowedEmails = accountNames.map((name) => `${name}@${process.env.PROJECT_ID}.iam.gserviceaccount.com`);
        if (!process.env.PROJECT_ID || !payload?.email_verified || !payload.email || !allowedEmails.includes(payload.email)) {
            logger.warn(`GCP auth: forbidden caller ${payload?.email} on ${req.method} ${req.originalUrl}`);
            res.status(403).send({ error: 'Forbidden' });
            return;
        }
        next();
    };
};
