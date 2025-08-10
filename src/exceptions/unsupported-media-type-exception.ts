import { HttpException } from "./http-exception";
import { HttpError } from "../types/http-error";

export class UnsupportedMediaTypeException extends HttpException {
    constructor(message?: string | object | Error) {
        super(HttpError.UNSUPPORTED_MEDIA_TYPE, message);
    }
}
