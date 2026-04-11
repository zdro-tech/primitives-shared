import { logger } from "../logger/logger.js";
export const retryOptions = {
    retry: (error, attemptNumber) => {
        logger.debug("Retrying openai request, attempt: " + attemptNumber + " error: ", error);
        return error.message.includes('timed out');
    },
    numOfAttempts: 2
};
export const getTimeoutMs = (specificTimeoutSeconds, fallbackTimeoutSeconds) => {
    const parsedSeconds = Number.parseInt(specificTimeoutSeconds ?? fallbackTimeoutSeconds ?? "30", 10);
    const timeoutSeconds = Number.isFinite(parsedSeconds) ? Math.max(parsedSeconds, 30) : 30;
    return timeoutSeconds * 1000;
};
