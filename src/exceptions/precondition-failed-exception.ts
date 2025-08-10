import { HttpException } from './http-exception';
import { HttpError } from '../types/http-error';

export class PreconditionFailedException extends HttpException {
  constructor(message?: string | object | Error) {
    super(HttpError.PRECONDITION_FAILED, message);
  }
}
