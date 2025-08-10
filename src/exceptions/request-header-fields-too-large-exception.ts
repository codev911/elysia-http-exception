import { HttpException } from "./http-exception";
import { HttpError } from "../types/http-error";

export class RequestHeaderFieldsTooLargeException extends HttpException {
    constructor(message?: string | object | Error) {
        super(HttpError.REQUEST_HEADER_FIELDS_TOO_LARGE, message);
    }
}
