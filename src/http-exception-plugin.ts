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

      if (code === 'NOT_FOUND') {
        const { code: httpCode, statusCode, message } = JSON.parse(HttpError.NOT_FOUND);
        set.headers['content-type'] = 'application/json; charset=utf-8';
        set.status = parseInt(httpCode, 10);
        return { statusCode, message };
      }
    });
