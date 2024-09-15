import mongoose, { Connection } from 'mongoose';
import _default from '../../config/default';
import logger from '../utils/logger';

const { MONGODB_URI } = _default;

class Database {
    static instance?: Database;
    private connection?: Connection;

    constructor() {
        this.onConnect();
    }

    static getInstance(): Database {
        if (!Database.instance) Database.instance = new Database();
        return Database.instance;
    }

    private async onConnect(): Promise<void> {
        try {
            this.connection = await mongoose.createConnection(MONGODB_URI);

            this.connection.on('connected', () => logger.info(`${this.connection?.name || 'MONGODB'} connected`));
            this.connection.on('disconnected', () => logger.info(`${this.connection?.name || 'MONGODB'} disconnected`));
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    public getConnection(): Connection | null {
        if (!this.connection) return null;
        return this.connection;
    }
}

export default Database.getInstance();
