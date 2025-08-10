import { HttpException } from './http-exception';
import { HttpError } from '../types/http-error';

export class PreconditionRequiredException extends HttpException {
  constructor(message?: string | object | Error) {
    super(HttpError.PRECONDITION_REQUIRED, message);
  }
}
