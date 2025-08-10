import { HttpException } from "./http-exception";
import { HttpError } from "../types/http-error";

export class UpgradeRequiredException extends HttpException {
    constructor(message?: string | object | Error) {
        super(HttpError.UPGRADE_REQUIRED, message);
    }
}
