import { HttpException } from "./http-exception";
import { HttpError } from "../types/http-error";

export class GoneException extends HttpException {
    constructor(message?: string | object | Error) {
        super(HttpError.GONE, message);
    }
}
