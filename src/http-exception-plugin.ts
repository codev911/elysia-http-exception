import { Elysia } from 'elysia';
import { HttpException } from './exceptions/http-exception';
import { HttpError } from './types/http-error';

export const httpExceptionPlugin = () =>
  new Elysia({ name: 'elysia-http-exception' })
    .decorate('httpException', (error: unknown) => {
      if (error instanceof HttpException) {
        return new Response(JSON.stringify(error.toBody()), {
          status: error.statusCode,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const message = error instanceof Error ? error.message : 'Internal server error';

      return new Response(JSON.stringify({ statusCode: 500, message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    })
    .onError({ as: 'scoped' }, ({ code, error, set }) => {
      if (error instanceof HttpException) {
        set.headers['content-type'] = 'application/json; charset=utf-8';
        set.status = error.statusCode;
        return error.toBody();
      }

      set.headers['content-type'] = 'application/json; charset=utf-8';

      switch (code) {
        case 'INVALID_COOKIE_SIGNATURE': {
          const { code: httpCode, statusCode } = JSON.parse(HttpError.BAD_REQUEST);
          const message = 'Invalid cookie signature';
          set.status = parseInt(httpCode, 10);
          return { statusCode, message };
        }

        case 'VALIDATION':
        case 'PARSE': {
          const { code: httpCode, statusCode } = JSON.parse(HttpError.BAD_REQUEST);
          const message = 'Invalid request payload';
          set.status = parseInt(httpCode, 10);
          return { statusCode, message };
        }

        case 'NOT_FOUND': {
          const { code: httpCode, statusCode, message } = JSON.parse(HttpError.NOT_FOUND);
          set.status = parseInt(httpCode, 10);
          return { statusCode, message };
        }

        case 'INVALID_FILE_TYPE': {
          const { code: httpCode, statusCode } = JSON.parse(HttpError.UNSUPPORTED_MEDIA_TYPE);
          const message = 'Invalid file type';
          set.status = parseInt(httpCode, 10);
          return { statusCode, message };
        }

        default: {
          const message = error instanceof Error ? error.message : 'Internal server error';
          set.status = 500;
          return { statusCode: 500, message };
        }
      }
    });
