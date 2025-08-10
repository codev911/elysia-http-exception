import { HttpException } from "./http-exception";
import { HttpError } from "../types/http-error";

export class ConflictException extends HttpException {
    constructor(message?: string | object | Error) {
        super(HttpError.CONFLICT, message);
    }
}
