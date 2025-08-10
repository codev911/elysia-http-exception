import { HttpException } from './http-exception';
import { HttpError } from '../types/http-error';

export class BadGatewayException extends HttpException {
  constructor(message?: string | object | Error) {
    super(HttpError.BAD_GATEWAY, message);
  }
}
