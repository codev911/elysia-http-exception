import { HttpException } from "./http-exception";
import { HttpError } from "../types/http-error";

export class GatewayTimeoutException extends HttpException {
    constructor(message?: string | object | Error) {
        super(HttpError.GATEWAY_TIMEOUT, message);
    }
}
