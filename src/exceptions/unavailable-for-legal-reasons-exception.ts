import { HttpException } from "./http-exception";
import { HttpError } from "../types/http-error";

export class UnavailableForLegalReasonsException extends HttpException {
    constructor(message?: string | object | Error) {
        super(HttpError.UNAVAILABLE_FOR_LEGAL_REASONS, message);
    }
}
