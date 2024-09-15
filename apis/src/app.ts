import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({
            code: '0001',
            metadata: 'hello world',
            message: 'Check healthy system successfully'
        });
    } catch (error) {
        next(error);
    }
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.code).json({
        metadata: null,
        message: err?.message || 'Error occur'
    });
});

export default app;
