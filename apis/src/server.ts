import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import logger from './utils/logger';
import _default from '../config/default';
import instance from './database/connect.database';

const { PORT } = _default;

function onRunServer() {
    app.listen(PORT, () => {
        instance.getConnection();
        logger.info(`Server is running at ${PORT}`);
    });
}

onRunServer();
