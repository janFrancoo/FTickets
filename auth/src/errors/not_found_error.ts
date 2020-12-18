import { CustomError } from "./custom_error";

export class NotFoundError extends CustomError {
    statusCode = 500;
    reason = "Endpoint not found";

    constructor() {
        super("Endpoint Not found");

        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors() {
        return [{
            message: this.reason
        }];
    }
}
