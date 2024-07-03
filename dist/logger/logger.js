import winston from 'winston';
const level = process.env.NODE_ENV === 'production' ? 'debug' : 'debug';
function tryToSerialize(meta) {
    if (typeof meta === 'object' && meta !== null) {
        try {
            return JSON.stringify(meta);
        }
        catch (e) { }
    }
    return meta;
}
const customFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}] : ${message} `;
    for (const [key, value] of Object.entries(metadata)) {
        msg += `${key}: ${value instanceof Error ? `Error: ${value.message}, Stack: ${value.stack}` : tryToSerialize(value)} `;
    }
    return msg.trim();
});
export const logger = winston.createLogger({
    level,
    format: winston.format.combine(winston.format.timestamp(), customFormat),
    transports: [
        // new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.Console()
    ]
});
