import { type Request, type Response, type NextFunction } from 'express';

function tryCatchHandler(cb: Function) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            next(error);
        }
    };
}

export default tryCatchHandler;
