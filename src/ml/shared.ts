import { logger } from "../logger/logger.js";
import { backOff, BackoffOptions } from "exponential-backoff";

export const retryOptions: BackoffOptions = {
    retry: (error: Error, attemptNumber: number) => {
        logger.debug("Retrying openai request, attempt: " + attemptNumber + " error: ", error);
        return error.message.includes('timed out');
    },
    numOfAttempts: 2
};