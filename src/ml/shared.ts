import { logger } from "../logger/logger.js";
import { backOff, BackoffOptions } from "exponential-backoff";

export const retryOptions: BackoffOptions = {
    retry: (error: Error, attemptNumber: number) => {
        logger.debug("Retrying openai request, attempt: " + attemptNumber + " error: ", error);
        return error.message.includes('timed out');
    },
    numOfAttempts: 2
};

export const getTimeoutMs = (specificTimeoutSeconds?: string, fallbackTimeoutSeconds?: string): number => {
    const parsedSeconds = Number.parseInt(specificTimeoutSeconds ?? fallbackTimeoutSeconds ?? "30", 10);
    const timeoutSeconds = Number.isFinite(parsedSeconds) ? Math.max(parsedSeconds, 30) : 30;
    return timeoutSeconds * 1000;
};
