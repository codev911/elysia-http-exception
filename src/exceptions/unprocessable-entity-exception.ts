import { HttpException } from './http-exception';
import { HttpError } from '../types/http-error';

export class UnprocessableEntityException extends HttpException {
  constructor(message?: string | object | Error) {
    super(HttpError.UNPROCESSABLE_ENTITY, message);
  }
}
