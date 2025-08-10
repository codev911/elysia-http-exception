import { HttpException } from './http-exception';
import { HttpError } from '../types/http-error';

export class NotImplementedException extends HttpException {
  constructor(message?: string | object | Error) {
    super(HttpError.NOT_IMPLEMENTED, message);
  }
}
