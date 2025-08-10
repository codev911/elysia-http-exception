import { HttpException } from './http-exception';
import { HttpError } from '../types/http-error';

export class UriTooLongException extends HttpException {
  constructor(message?: string | object | Error) {
    super(HttpError.URI_TOO_LONG, message);
  }
}
