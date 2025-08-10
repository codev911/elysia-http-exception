import { HttpException } from "./http-exception";
import { HttpError } from "../types/http-error";

export class PayloadTooLargeException extends HttpException {
    constructor(message?: string | object | Error) {
        super(HttpError.PAYLOAD_TOO_LARGE, message);
    }
}
