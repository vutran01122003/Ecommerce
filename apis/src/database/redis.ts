import Redis from "ioredis";
import logger from "../utils/logger";

const connectRedis = () => {
    const client = new Redis({
        port: 6379,
        host: "127.0.0.1",
    });

    logger.info("Redis connected");

    return client;
};

export default connectRedis();
