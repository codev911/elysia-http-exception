import { HttpException } from './http-exception';
import { HttpError } from '../types/http-error';

export class InternalServerErrorException extends HttpException {
  constructor(message?: string | object | Error) {
    super(HttpError.INTERNAL_SERVER_ERROR, message);
  }
}
