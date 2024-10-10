import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import logger from "./utils/logger";
import _default from "../config/default";

const { PORT } = _default;

function onRunServer() {
    try {
        app.listen(PORT, () => {
            logger.info(`Server is running at ${PORT}`);
        });
    } catch (error: any) {
        throw error;
    }
}

onRunServer();
