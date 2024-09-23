import dotenv from 'dotenv';
dotenv.config();

const DEV = {
    PORT: process.env.DEV_APP_PORT as string,
    MONGODB_URI: process.env.DEV_MONGODB_URI as string,
    SALT_WORK_FACTORY: 10,
    ACCESS_TOKEN_TTL: '15m',
    REFRESH_TOKEN_TTL: '1y'
};

const PRO = {
    PORT: process.env.PRO_APP_PORT as string,
    MONGODB_URI: process.env.PRO_MONGODB_URI as string,
    SALT_WORK_FACTORY: 10,
    ACCESS_TOKEN_TTL: '15m',
    REFRESH_TOKEN_TTL: '1y'
};

const config = { DEV, PRO };

const NODE_ENV = (process.env.NODE_ENV as string) === 'DEV' ? 'DEV' : 'PRO';

export default config[NODE_ENV];
