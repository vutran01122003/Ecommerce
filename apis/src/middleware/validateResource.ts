import { ZodSchema } from 'zod';
import { type Request, type Response, type NextFunction } from 'express';

const validateInput = (schema: ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            params: req.params,
            query: req.query
        });
        next();
    } catch (error) {
        next(error);
    }
};

export default validateInput;
