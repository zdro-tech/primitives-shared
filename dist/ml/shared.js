import { logger } from "../logger/logger.js";
export const retryOptions = {
    retry: (error, attemptNumber) => {
        logger.debug("Retrying openai request, attempt: " + attemptNumber + " error: ", error);
        return error.message.includes('timed out');
    },
    numOfAttempts: 2
};
