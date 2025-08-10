import { HttpException } from "./http-exception";
import { HttpError } from "../types/http-error";

export class LockedException extends HttpException {
    constructor(message?: string | object | Error) {
        super(HttpError.LOCKED, message);
    }
}
