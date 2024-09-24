import { messageError, statusCodeError } from './statusCode';

class ErrorResponse extends Error {
    message!: string;
    statusCode!: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class ConflictError extends ErrorResponse {
    constructor(message = messageError.CONFLICT) {
        super(statusCodeError.CONFLICT, message);
    }
}

export class NotFoundError extends ErrorResponse {
    constructor(message = messageError.NOTFOUND) {
        super(statusCodeError.NOTFOUND, message);
    }
}

export class BadRequestError extends ErrorResponse {
    constructor(message = messageError.BAD_REQUEST) {
        super(statusCodeError.BAD_REQUEST, message);
    }
}

export class UnauthorizedError extends ErrorResponse {
    constructor(message = messageError.UNAUTHORIZED) {
        super(statusCodeError.UNAUTHORIZED, message);
    }
}

export class ForbiddenError extends ErrorResponse {
    constructor(message = messageError.FORBIDDEN) {
        super(statusCodeError.FORBIDDEN, message);
    }
}

export default ErrorResponse;
