import { HttpException } from "./http-exception";
import { HttpError } from "../types/http-error";

export class VariantAlsoNegotiatesException extends HttpException {
    constructor(message?: string | object | Error) {
        super(HttpError.VARIANT_ALSO_NEGOTIATES, message);
    }
}
