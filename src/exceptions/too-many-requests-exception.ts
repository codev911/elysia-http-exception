import { HttpException } from './http-exception';
import { HttpError } from '../types/http-error';

export class TooManyRequestsException extends HttpException {
  constructor(message?: string | object | Error) {
    super(HttpError.TOO_MANY_REQUESTS, message);
  }
}
