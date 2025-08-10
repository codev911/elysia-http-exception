import { HttpException } from "./http-exception";
import { HttpError } from "../types/http-error";

export class RequestTimeoutException extends HttpException {
    constructor(message?: string | object | Error) {
        super(HttpError.REQUEST_TIMEOUT, message);
    }
}
