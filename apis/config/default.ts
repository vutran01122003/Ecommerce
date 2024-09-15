import dotenv from 'dotenv';
dotenv.config();

const DEV = {
    PORT: process.env.DEV_APP_PORT as string,
    MONGODB_URI: process.env.DEV_MONGODB_URI as string
};

const PRO = {
    PORT: process.env.PRO_APP_PORT as string,
    MONGODB_URI: process.env.PRO_MONGODB_URI as string
};

const config = { DEV, PRO };

const NODE_ENV = (process.env.NODE_ENV as string) === 'DEV' ? 'DEV' : 'PRO';

export default config[NODE_ENV];
