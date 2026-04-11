import { logger } from "../logger/logger.js";
export const retryOptions = {
    retry: (error, attemptNumber) => {
        logger.debug("Retrying openai request, attempt: " + attemptNumber + " error: ", error);
        return error.message.includes('timed out');
    },
    numOfAttempts: 2
};
export const getTimeoutMs = (specificTimeoutSeconds, fallbackTimeoutSeconds) => {
    const timeoutSeconds = Number.parseInt(specificTimeoutSeconds ?? fallbackTimeoutSeconds ?? "30", 10) || 30;
    return Math.min(timeoutSeconds, 90) * 1000;
};
