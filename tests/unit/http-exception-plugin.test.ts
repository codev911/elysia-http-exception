import { describe, expect, it, beforeEach } from 'bun:test';
import { Elysia } from 'elysia';
import { httpExceptionPlugin } from '../../src/http-exception-plugin';
import { 
  BadRequestException, 
  UnauthorizedException,
  PaymentRequiredException,
  ForbiddenException,
  NotFoundException,
  MethodNotAllowedException,
  NotAcceptableException,
  RequestTimeoutException,
  ConflictException,
  GoneException,
  LengthRequiredException,
  PreconditionFailedException,
  PayloadTooLargeException,
  UriTooLongException,
  UnsupportedMediaTypeException,
  RangeNotSatisfiableException,
  ExpectationFailedException,
  ImATeapotException,
  MisdirectedRequestException,
  UnprocessableEntityException,
  LockedException,
  FailedDependencyException,
  TooEarlyException,
  UpgradeRequiredException,
  PreconditionRequiredException,
  TooManyRequestsException,
  RequestHeaderFieldsTooLargeException,
  UnavailableForLegalReasonsException,
  InternalServerErrorException,
  NotImplementedException,
  BadGatewayException,
  ServiceUnavailableException,
  GatewayTimeoutException,
  HttpVersionNotSupportedException,
  VariantAlsoNegotiatesException,
  InsufficientStorageException,
  LoopDetectedException,
  NotExtendedException,
  NetworkAuthenticationRequiredException
} from '../../src';

describe('HTTP Exception Plugin', () => {
  let app: any;

  beforeEach(() => {
    app = new Elysia().use(httpExceptionPlugin());
  });

  describe('Plugin Setup', () => {
    it('should return an Elysia instance', () => {
      const plugin = httpExceptionPlugin();
      expect(plugin).toBeInstanceOf(Elysia);
    });

    it('should be composable with other Elysia apps', () => {
      const app = new Elysia();
      const result = app.use(httpExceptionPlugin());
      expect(result).toBeInstanceOf(Elysia);
    });

    it('should provide httpException decorator', () => {
      const app = new Elysia().use(httpExceptionPlugin());
      
      // Check if the decorator is available in the app's decorator store
      expect(app.decorator).toHaveProperty('httpException');
    });

    it('should create plugin with correct name', () => {
      const plugin = httpExceptionPlugin();
      expect(plugin.config.name).toBe('elysia-http-exception');
    });
  });

  describe('httpException Decorator', () => {
    it('should handle HttpException in decorator', async () => {
      const plugin = httpExceptionPlugin();
      const httpException = plugin.decorator.httpException;
      
      const error = new BadRequestException('Invalid input');
      const response = httpException(error);
      
      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(400);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      
      const body = await response.json();
      expect(body).toEqual({
        statusCode: 400,
        message: 'Invalid input'
      });
    });

    it('should handle HttpException with object data', async () => {
      const plugin = httpExceptionPlugin();
      const httpException = plugin.decorator.httpException;
      
      const errorData = { error: 'VALIDATION_FAILED', field: 'email' };
      const error = new BadRequestException(errorData);
      const response = httpException(error);
      
      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(400);
      
      const body = await response.json();
      expect(body).toEqual(errorData);
    });

    it('should handle generic Error objects in decorator', async () => {
      const plugin = httpExceptionPlugin();
      const httpException = plugin.decorator.httpException;
      
      const error = new Error('Some error');
      const response = httpException(error);
      
      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(500);
      
      const body = await response.json();
      expect(body).toEqual({
        statusCode: 500,
        message: 'Some error'
      });
    });

    it('should handle non-error values in decorator', async () => {
      const plugin = httpExceptionPlugin();
      const httpException = plugin.decorator.httpException;
      
      const response = httpException('Some error message');
      
      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(500);
      
      const body = await response.json();
      expect(body).toEqual({
        statusCode: 500,
        message: 'Internal server error'
      });
    });

    it('should handle null values in decorator', async () => {
      const plugin = httpExceptionPlugin();
      const httpException = plugin.decorator.httpException;
      
      const response = httpException(null);
      
      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(500);
      
      const body = await response.json();
      expect(body).toEqual({
        statusCode: 500,
        message: 'Internal server error'
      });
    });

    it('should handle undefined values in decorator', async () => {
      const plugin = httpExceptionPlugin();
      const httpException = plugin.decorator.httpException;
      
      const response = httpException(undefined);
      
      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(500);
      
      const body = await response.json();
      expect(body).toEqual({
        statusCode: 500,
        message: 'Internal server error'
      });
    });
  });

  describe('onError Handler', () => {
    it('should handle HttpException in onError', async () => {
      const app = new Elysia()
        .use(httpExceptionPlugin())
        .get('/test', () => {
          throw new BadRequestException('Test error');
        });

      const response = await app.handle(new Request('http://localhost/test'));
      
      expect(response.status).toBe(400);
      expect(response.headers.get('content-type')).toContain('application/json');
      
      const body = await response.json();
      expect(body).toEqual({
        statusCode: 400,
        message: 'Test error'
      });
    });

    it('should handle HttpException with object data in onError', async () => {
      const errorData = { error: 'VALIDATION_ERROR', details: { field: 'email' } };
      const app = new Elysia()
        .use(httpExceptionPlugin())
        .get('/test', () => {
          throw new UnprocessableEntityException(errorData);
        });

      const response = await app.handle(new Request('http://localhost/test'));
      
      expect(response.status).toBe(422);
      
      const body = await response.json();
      expect(body).toEqual(errorData);
    });

    it('should handle INVALID_COOKIE_SIGNATURE error code', async () => {
      // We need to create a custom Elysia context to trigger the onError handler directly
      const plugin = httpExceptionPlugin();
      const errorHandler = (plugin as any).event.error[0].fn;
      
      const mockSet = {
        headers: {},
        status: 200 // Start with valid status
      };
      
      const mockError = new Error('Invalid cookie signature');
      
      const result = errorHandler({
        code: 'INVALID_COOKIE_SIGNATURE',
        error: mockError,
        set: mockSet
      });
      
      expect(mockSet.status).toBe(400);
      expect(mockSet.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(result).toEqual({
        statusCode: 400,
        message: 'Invalid cookie signature'
      });
    });

    it('should handle VALIDATION error code', async () => {
      const plugin = httpExceptionPlugin();
      const errorHandler = (plugin as any).event.error[0].fn;
      
      const mockSet = {
        headers: {},
        status: 200
      };
      
      const mockError = new Error('Validation failed');
      
      const result = errorHandler({
        code: 'VALIDATION',
        error: mockError,
        set: mockSet
      });
      
      expect(mockSet.status).toBe(400);
      expect(mockSet.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(result).toEqual({
        statusCode: 400,
        message: 'Invalid request payload'
      });
    });

    it('should handle PARSE error code', async () => {
      const plugin = httpExceptionPlugin();
      const errorHandler = (plugin as any).event.error[0].fn;
      
      const mockSet = {
        headers: {},
        status: 200
      };
      
      const mockError = new Error('Parse error');
      
      const result = errorHandler({
        code: 'PARSE',
        error: mockError,
        set: mockSet
      });
      
      expect(mockSet.status).toBe(400);
      expect(mockSet.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(result).toEqual({
        statusCode: 400,
        message: 'Invalid request payload'
      });
    });

    it('should handle NOT_FOUND error code', async () => {
      const plugin = httpExceptionPlugin();
      const errorHandler = (plugin as any).event.error[0].fn;
      
      const mockSet = {
        headers: {},
        status: 200
      };
      
      const mockError = new Error('Not found');
      
      const result = errorHandler({
        code: 'NOT_FOUND',
        error: mockError,
        set: mockSet
      });
      
      expect(mockSet.status).toBe(404);
      expect(mockSet.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(result).toEqual({
        statusCode: 404,
        message: 'Not Found'
      });
    });

    it('should handle INVALID_FILE_TYPE error code', async () => {
      const plugin = httpExceptionPlugin();
      const errorHandler = (plugin as any).event.error[0].fn;
      
      const mockSet = {
        headers: {},
        status: 200
      };
      
      const mockError = new Error('Invalid file type');
      
      const result = errorHandler({
        code: 'INVALID_FILE_TYPE',
        error: mockError,
        set: mockSet
      });
      
      expect(mockSet.status).toBe(415);
      expect(mockSet.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(result).toEqual({
        statusCode: 415,
        message: 'Invalid file type'
      });
    });

    it('should handle unknown error codes with Error object', async () => {
      // Test through a simulated app with unknown error
      const app = new Elysia()
        .use(httpExceptionPlugin())
        .get('/test', () => {
          const error = new Error('Unknown error message') as any;
          error.code = 'UNKNOWN_ERROR';
          throw error;
        });

      const response = await app.handle(new Request('http://localhost/test'));
      
      expect(response.status).toBe(500);
      
      const body = await response.json();
      expect(body).toEqual({
        statusCode: 500,
        message: 'Unknown error message'
      });
    });

    it('should handle unknown error codes with non-Error object', async () => {
      // Test through a simulated app with non-Error object
      const app = new Elysia()
        .use(httpExceptionPlugin())
        .get('/test', () => {
          // This should trigger the default error handling
          throw 'Some string error';
        });

      const response = await app.handle(new Request('http://localhost/test'));
      
      expect(response.status).toBe(500);
      
      const body = await response.json();
      expect(body).toEqual({
        statusCode: 500,
        message: 'Internal server error'
      });
    });

    it('should handle unknown error codes with null error', async () => {
      // Test directly with the error handler to avoid Elysia internal issues
      const plugin = httpExceptionPlugin();
      const errorHandler = (plugin as any).event.error[0].fn;
      
      const mockSet = {
        headers: {},
        status: 200
      };
      
      const result = errorHandler({
        code: 'UNKNOWN_ERROR',
        error: null,
        set: mockSet
      });
      
      expect(mockSet.status).toBe(500);
      expect(mockSet.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(result).toEqual({
        statusCode: 500,
        message: 'Internal server error'
      });
    });
  });

  describe('All HTTP Exception Classes Coverage', () => {
    const exceptionTests = [
      { Exception: BadRequestException, status: 400, name: 'BadRequestException' },
      { Exception: UnauthorizedException, status: 401, name: 'UnauthorizedException' },
      { Exception: PaymentRequiredException, status: 402, name: 'PaymentRequiredException' },
      { Exception: ForbiddenException, status: 403, name: 'ForbiddenException' },
      { Exception: NotFoundException, status: 404, name: 'NotFoundException' },
      { Exception: MethodNotAllowedException, status: 405, name: 'MethodNotAllowedException' },
      { Exception: NotAcceptableException, status: 406, name: 'NotAcceptableException' },
      { Exception: RequestTimeoutException, status: 408, name: 'RequestTimeoutException' },
      { Exception: ConflictException, status: 409, name: 'ConflictException' },
      { Exception: GoneException, status: 410, name: 'GoneException' },
      { Exception: LengthRequiredException, status: 411, name: 'LengthRequiredException' },
      { Exception: PreconditionFailedException, status: 412, name: 'PreconditionFailedException' },
      { Exception: PayloadTooLargeException, status: 413, name: 'PayloadTooLargeException' },
      { Exception: UriTooLongException, status: 414, name: 'UriTooLongException' },
      { Exception: UnsupportedMediaTypeException, status: 415, name: 'UnsupportedMediaTypeException' },
      { Exception: RangeNotSatisfiableException, status: 416, name: 'RangeNotSatisfiableException' },
      { Exception: ExpectationFailedException, status: 417, name: 'ExpectationFailedException' },
      { Exception: ImATeapotException, status: 418, name: 'ImATeapotException' },
      { Exception: MisdirectedRequestException, status: 421, name: 'MisdirectedRequestException' },
      { Exception: UnprocessableEntityException, status: 422, name: 'UnprocessableEntityException' },
      { Exception: LockedException, status: 423, name: 'LockedException' },
      { Exception: FailedDependencyException, status: 424, name: 'FailedDependencyException' },
      { Exception: TooEarlyException, status: 425, name: 'TooEarlyException' },
      { Exception: UpgradeRequiredException, status: 426, name: 'UpgradeRequiredException' },
      { Exception: PreconditionRequiredException, status: 428, name: 'PreconditionRequiredException' },
      { Exception: TooManyRequestsException, status: 429, name: 'TooManyRequestsException' },
      { Exception: RequestHeaderFieldsTooLargeException, status: 431, name: 'RequestHeaderFieldsTooLargeException' },
      { Exception: UnavailableForLegalReasonsException, status: 451, name: 'UnavailableForLegalReasonsException' },
      { Exception: InternalServerErrorException, status: 500, name: 'InternalServerErrorException' },
      { Exception: NotImplementedException, status: 501, name: 'NotImplementedException' },
      { Exception: BadGatewayException, status: 502, name: 'BadGatewayException' },
      { Exception: ServiceUnavailableException, status: 503, name: 'ServiceUnavailableException' },
      { Exception: GatewayTimeoutException, status: 504, name: 'GatewayTimeoutException' },
      { Exception: HttpVersionNotSupportedException, status: 505, name: 'HttpVersionNotSupportedException' },
      { Exception: VariantAlsoNegotiatesException, status: 506, name: 'VariantAlsoNegotiatesException' },
      { Exception: InsufficientStorageException, status: 507, name: 'InsufficientStorageException' },
      { Exception: LoopDetectedException, status: 508, name: 'LoopDetectedException' },
      { Exception: NotExtendedException, status: 510, name: 'NotExtendedException' },
      { Exception: NetworkAuthenticationRequiredException, status: 511, name: 'NetworkAuthenticationRequiredException' },
    ];

    exceptionTests.forEach(({ Exception, status, name }) => {
      it(`should handle ${name} with string message`, async () => {
        const app = new Elysia()
          .use(httpExceptionPlugin())
          .get('/test', () => {
            throw new Exception('Test message');
          });

        const response = await app.handle(new Request('http://localhost/test'));
        
        expect(response.status).toBe(status);
        
        const body = await response.json();
        expect(body).toEqual({
          statusCode: status,
          message: 'Test message'
        });
      });

      it(`should handle ${name} with object data`, async () => {
        const errorData = { error: 'CUSTOM_ERROR', details: 'Some details' };
        const app = new Elysia()
          .use(httpExceptionPlugin())
          .get('/test', () => {
            throw new Exception(errorData);
          });

        const response = await app.handle(new Request('http://localhost/test'));
        
        expect(response.status).toBe(status);
        
        const body = await response.json();
        expect(body).toEqual(errorData);
      });

      it(`should handle ${name} in decorator`, async () => {
        const plugin = httpExceptionPlugin();
        const httpException = plugin.decorator.httpException;
        
        const error = new Exception('Decorator test');
        const response = httpException(error);
        
        expect(response).toBeInstanceOf(Response);
        expect(response.status).toBe(status);
        
        const body = await response.json();
        expect(body).toEqual({
          statusCode: status,
          message: 'Decorator test'
        });
      });
    });
  });

  describe('Integration Tests', () => {
    it('should work with throw statements', async () => {
      const app = new Elysia()
        .use(httpExceptionPlugin())
        .get('/test', () => {
          throw new NotFoundException('Resource not found');
        });

      const response = await app.handle(new Request('http://localhost/test'));
      
      expect(response.status).toBe(404);
      
      const body = await response.json();
      expect(body).toEqual({
        statusCode: 404,
        message: 'Resource not found'
      });
    });

    it('should work with httpException decorator', async () => {
      const app = new Elysia()
        .use(httpExceptionPlugin())
        .get('/test', ({ httpException }) => {
          return httpException(new InternalServerErrorException('Server error'));
        });

      const response = await app.handle(new Request('http://localhost/test'));
      
      expect(response.status).toBe(500);
      
      const body = await response.json();
      expect(body).toEqual({
        statusCode: 500,
        message: 'Server error'
      });
    });

    it('should preserve original error handling for non-HTTP exceptions', async () => {
      const app = new Elysia()
        .use(httpExceptionPlugin())
        .get('/test', () => {
          throw new Error('Regular error');
        });

      const response = await app.handle(new Request('http://localhost/test'));
      
      expect(response.status).toBe(500);
      
      const body = await response.json();
      expect(body).toEqual({
        statusCode: 500,
        message: 'Regular error'
      });
    });
  });
});
