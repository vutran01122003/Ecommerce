export class ErrorResponse extends Error {
    status?: number;
    message!: string;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}
