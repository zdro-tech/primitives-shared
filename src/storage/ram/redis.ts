import { createClient, RedisClientOptions } from "redis";
import prexit from "prexit";
import { logger } from "../../logger/logger.js";

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT ?? '6379'),
        ...(process.env.REDIS_PASSWORD && { tls: true }),
    },
    ...(process.env.REDIS_PASSWORD && { password: process.env.REDIS_PASSWORD }),

} as RedisClientOptions);

const connectRedis = async () => {
    await redisClient.connect();
    logger.debug(`Connected to Redis with REDIS_HOST: ${process.env.REDIS_HOST} and REDIS_PORT: ${process.env.REDIS_PORT}`);
    const pong = await redisClient.ping();
    logger.debug(`Redis ping reply is: ${pong}`);
};

await connectRedis()

prexit(async () => {
    await redisClient.disconnect();
});

export { redisClient };
