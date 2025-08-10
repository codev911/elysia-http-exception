import { HttpException } from './http-exception';
import { HttpError } from '../types/http-error';

export class ForbiddenException extends HttpException {
  constructor(message?: string | object | Error) {
    super(HttpError.FORBIDDEN, message);
  }
}
