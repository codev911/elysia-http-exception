import { HttpException } from './http-exception';
import { HttpError } from '../types/http-error';

export class FailedDependencyException extends HttpException {
  constructor(message?: string | object | Error) {
    super(HttpError.FAILED_DEPENDENCY, message);
  }
}
