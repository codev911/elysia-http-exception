import { HttpException } from './http-exception';
import { HttpError } from '../types/http-error';

export class InsufficientStorageException extends HttpException {
  constructor(message?: string | object | Error) {
    super(HttpError.INSUFFICIENT_STORAGE, message);
  }
}
