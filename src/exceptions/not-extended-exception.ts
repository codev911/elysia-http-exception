import { HttpException } from "./http-exception";
import { HttpError } from "../types/http-error";

export class NotExtendedException extends HttpException {
    constructor(message?: string | object | Error) {
        super(HttpError.NOT_EXTENDED, message);
    }
}
