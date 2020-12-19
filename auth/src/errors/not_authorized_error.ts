import { CustomError } from "./custom_error";

export class NotAuthorizedError extends CustomError {
    statusCode = 401;
    reason = "Not auhorized";

    constructor() {
        super("Not authorized");

        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    serializeErrors() {
        return [{
            message: this.reason
        }];
    }
}
