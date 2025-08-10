import { HttpException } from './http-exception';
import { HttpError } from '../types/http-error';

export class HttpVersionNotSupportedException extends HttpException {
  constructor(message?: string | object | Error) {
    super(HttpError.HTTP_VERSION_NOT_SUPPORTED, message);
  }
}
