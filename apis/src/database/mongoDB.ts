import mongoose, { type Connection } from 'mongoose';
import _default from '../../config/default';
import logger from '../utils/logger';

const { MONGODB_URI } = _default;

class MongoDB {
    static instance?: MongoDB;
    private connection!: Connection;

    constructor() {
        this.onConnect();
    }

    static getInstance(): MongoDB {
        if (!MongoDB.instance) MongoDB.instance = new MongoDB();

        return MongoDB.instance;
    }

    private onConnect(): void {
        try {
            this.connection = mongoose.createConnection(MONGODB_URI);

            this.connection.on('connected', () => logger.info(`${this.connection.name || 'MONGODB'} connected`));
            this.connection.on('error', (error: any) => {
                throw error;
            });
            this.connection.on('disconnected', () => logger.info(`${this.connection.name || 'MONGODB'} disconnected`));
        } catch (error: any) {
            throw error;
        }
    }

    public getConnection(): Connection {
        return this.connection;
    }
}

export default MongoDB.getInstance();
