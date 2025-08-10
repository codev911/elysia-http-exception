import { HttpException } from './http-exception';
import { HttpError } from '../types/http-error';

export class ImATeapotException extends HttpException {
  constructor(message?: string | object | Error) {
    super(HttpError.IM_A_TEAPOT, message);
  }
}
