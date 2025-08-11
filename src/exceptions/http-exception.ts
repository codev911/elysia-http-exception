import { HttpError } from '../types/http-error';

type Payload = { statusCode: number; code: string; message: string };

export class HttpException extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly data?: unknown;
  public readonly isHttpException = true;

  constructor(httpError: HttpError, message?: string | object | Error | unknown) {
    const { statusCode, code, message: defaultMsg } = JSON.parse(httpError) as Payload;

    const finalMsg =
      message instanceof Error
        ? message.message
        : typeof message === 'string'
          ? message
          : defaultMsg;

    super(finalMsg);
    this.name = new.target.name;

    this.statusCode = statusCode; // number
    this.code = code; // string e.g. "INTERNAL_SERVER_ERROR"

    if (message && typeof message === 'object' && !(message instanceof Error)) {
      this.data = message; // custom object dikembalikan apa adanya di toBody()
    }

    // buat enumerable agar ikut saat JSON.stringify(err)
    Object.defineProperties(this, {
      statusCode: { enumerable: true },
      code: { enumerable: true },
      message: { enumerable: true },
      name: { enumerable: true },
      isHttpException: { enumerable: true },
      data: { enumerable: true },
    });
  }

  toBody(): unknown {
    if (this.data && typeof this.data === 'object') return this.data;
    return { statusCode: this.statusCode, message: this.message };
  }
}
