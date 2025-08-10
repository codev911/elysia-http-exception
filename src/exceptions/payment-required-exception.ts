import { HttpException } from "./http-exception";
import { HttpError } from "../types/http-error";

export class PaymentRequiredException extends HttpException {
    constructor(message?: string | object | Error) {
        super(HttpError.PAYMENT_REQUIRED, message);
    }
}
