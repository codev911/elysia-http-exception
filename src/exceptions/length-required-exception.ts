import { HttpException } from './http-exception';
import { HttpError } from '../types/http-error';

export class LengthRequiredException extends HttpException {
  constructor(message?: string | object | Error) {
    super(HttpError.LENGTH_REQUIRED, message);
  }
}
