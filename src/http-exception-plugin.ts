import { Elysia } from 'elysia';
import { HttpException } from './exceptions/http-exception';

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
    .onError(({ error, set }) => {
      if (error instanceof HttpException) {
        set.status = error.statusCode;
        return error.toBody();
      }
      set.status = 500;
      return { statusCode: 500, message: 'Internal server error' };
    });
