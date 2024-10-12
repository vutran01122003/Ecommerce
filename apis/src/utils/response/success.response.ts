import { Response } from "express";
import { messageSuccess, statusCodeSuccess } from "../../shared/statusCode";

class SuccessResponse {
    private statusCode!: number;
    private message!: string;
    private metadata?: any;
    private options?: Object | null;

    constructor(statusCode: number, message: string, metadata?: any, options?: Object) {
        this.statusCode = statusCode;
        this.message = message;
        this.metadata = metadata ? metadata : null;
        this.options = options ? options : null;
    }

    public send(res: Response) {
        return res.status(this.statusCode).json({
            message: this.message,
            metadata: this.metadata,
            ...(this.options && this.options),
        });
    }
}

export class Ok extends SuccessResponse {
    constructor(message = messageSuccess.OK, metadata?: any) {
        super(statusCodeSuccess.OK, message, metadata);
    }
}

export class Created extends SuccessResponse {
    constructor(message = messageSuccess.CREATED, metadata?: any, options?: object) {
        super(statusCodeSuccess.CREATED, message, metadata, options);
    }
}

export class Updated extends SuccessResponse {
    constructor(message = messageSuccess.UPDATED, metadata?: any, options?: object) {
        super(statusCodeSuccess.UPDATED, message, metadata, options);
    }
}

export class Deleted extends SuccessResponse {
    constructor(message = messageSuccess.DELETED, metadata?: any, options?: object) {
        super(statusCodeSuccess.DELETED, message, metadata, options);
    }
}

export default SuccessResponse;
