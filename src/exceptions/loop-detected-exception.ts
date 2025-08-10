import { HttpException } from "./http-exception";
import { HttpError } from "../types/http-error";

export class LoopDetectedException extends HttpException {
    constructor(message?: string | object | Error) {
        super(HttpError.LOOP_DETECTED, message);
    }
}
