import { HttpException } from './http-exception';
import { HttpError } from '../types/http-error';

export class NetworkAuthenticationRequiredException extends HttpException {
  constructor(message?: string | object | Error) {
    super(HttpError.NETWORK_AUTHENTICATION_REQUIRED, message);
  }
}
