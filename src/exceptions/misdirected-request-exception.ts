import { HttpException } from "./http-exception";
import { HttpError } from "../types/http-error";

export class MisdirectedRequestException extends HttpException {
    constructor(message?: string | object | Error) {
        super(HttpError.MISDIRECTED_REQUEST, message);
    }
}
