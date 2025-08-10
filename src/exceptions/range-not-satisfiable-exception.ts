import { HttpException } from './http-exception';
import { HttpError } from '../types/http-error';

export class RangeNotSatisfiableException extends HttpException {
  constructor(message?: string | object | Error) {
    super(HttpError.RANGE_NOT_SATISFIABLE, message);
  }
}
