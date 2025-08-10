import { HttpException } from './http-exception';
import { HttpError } from '../types/http-error';

export class MethodNotAllowedException extends HttpException {
  constructor(message?: string | object | Error) {
    super(HttpError.METHOD_NOT_ALLOWED, message);
  }
}
