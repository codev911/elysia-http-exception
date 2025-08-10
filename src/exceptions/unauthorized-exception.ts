import { HttpException } from "./http-exception";
import { HttpError } from "../types/http-error";

export class UnauthorizedException extends HttpException {
    constructor(message?: string | object | Error) {
        super(HttpError.UNAUTHORIZED, message);
    }
}
