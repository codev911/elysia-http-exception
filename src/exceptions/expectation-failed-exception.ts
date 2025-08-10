import { HttpException } from "./http-exception";
import { HttpError } from "../types/http-error";

export class ExpectationFailedException extends HttpException {
    constructor(message?: string | object | Error) {
        super(HttpError.EXPECTATION_FAILED, message);
    }
}
