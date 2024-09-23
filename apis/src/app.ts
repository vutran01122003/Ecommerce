import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import router from './routers';
import { ZodError } from 'zod';
import { ErrorResponse } from './expection/errorResponse';
import { JsonWebTokenError } from 'jsonwebtoken';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(router);

app.use((res: Request, req: Response, next: NextFunction) => {
    const error = new ErrorResponse(404, 'Notfound Endpoint');
    next(error);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ZodError) {
        return res.status(400).json({
            message: err.issues[0].message,
            name: err.name
        });
    }

    if (err instanceof JsonWebTokenError) {
        return res.status(400).json({
            message: err.message,
            name: err.name
        });
    }

    return res.status(err?.status || 500).json({
        message: err?.message || JSON.stringify(err)
    });
});

export default app;
