import { HttpException } from "./http-exception";
import { HttpError } from "../types/http-error";

export class TooEarlyException extends HttpException {
    constructor(message?: string | object | Error) {
        super(HttpError.TOO_EARLY, message);
    }
}
