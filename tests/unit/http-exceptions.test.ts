import { describe, it, expect } from 'bun:test';
import {
  // 4xx Client Errors
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
  // 5xx Server Errors
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
  NetworkAuthenticationRequiredException,
} from '../../src/index';
import { HttpException } from '../../src/exceptions/http-exception';

type ErrorBody = {
  statusCode: number;
  message: any;
};

describe('HTTP Exception Classes', () => {
  describe('4xx Client Error Exceptions', () => {
    it('should create BadRequestException with correct status code', () => {
      const exception = new BadRequestException('Invalid input');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(400);
      expect(exception.message).toBe('Invalid input');
      expect(exception.name).toBe('BadRequestException');
    });

    it('should create UnauthorizedException with correct status code', () => {
      const exception = new UnauthorizedException('Not authenticated');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(401);
      expect(exception.message).toBe('Not authenticated');
      expect(exception.name).toBe('UnauthorizedException');
    });

    it('should create PaymentRequiredException with correct status code', () => {
      const exception = new PaymentRequiredException('Payment required');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(402);
      expect(exception.message).toBe('Payment required');
      expect(exception.name).toBe('PaymentRequiredException');
    });

    it('should create ForbiddenException with correct status code', () => {
      const exception = new ForbiddenException('Access denied');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(403);
      expect(exception.message).toBe('Access denied');
      expect(exception.name).toBe('ForbiddenException');
    });

    it('should create NotFoundException with correct status code', () => {
      const exception = new NotFoundException('Resource not found');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(404);
      expect(exception.message).toBe('Resource not found');
      expect(exception.name).toBe('NotFoundException');
    });

    it('should create MethodNotAllowedException with correct status code', () => {
      const exception = new MethodNotAllowedException('Method not allowed');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(405);
      expect(exception.message).toBe('Method not allowed');
      expect(exception.name).toBe('MethodNotAllowedException');
    });

    it('should create ImATeapotException with correct status code', () => {
      const exception = new ImATeapotException("I'm a teapot");
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(418);
      expect(exception.message).toBe("I'm a teapot");
      expect(exception.name).toBe('ImATeapotException');
    });

    it('should create UnprocessableEntityException with correct status code', () => {
      const exception = new UnprocessableEntityException('Validation failed');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(422);
      expect(exception.message).toBe('Validation failed');
      expect(exception.name).toBe('UnprocessableEntityException');
    });

    it('should create TooManyRequestsException with correct status code', () => {
      const exception = new TooManyRequestsException('Rate limit exceeded');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(429);
      expect(exception.message).toBe('Rate limit exceeded');
      expect(exception.name).toBe('TooManyRequestsException');
    });

    it('should create NotAcceptableException with correct status code', () => {
      const exception = new NotAcceptableException('Not acceptable');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(406);
      expect(exception.message).toBe('Not acceptable');
      expect(exception.name).toBe('NotAcceptableException');
    });

    it('should create RequestTimeoutException with correct status code', () => {
      const exception = new RequestTimeoutException('Request timeout');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(408);
      expect(exception.message).toBe('Request timeout');
      expect(exception.name).toBe('RequestTimeoutException');
    });

    it('should create ConflictException with correct status code', () => {
      const exception = new ConflictException('Resource conflict');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(409);
      expect(exception.message).toBe('Resource conflict');
      expect(exception.name).toBe('ConflictException');
    });

    it('should create GoneException with correct status code', () => {
      const exception = new GoneException('Resource gone');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(410);
      expect(exception.message).toBe('Resource gone');
      expect(exception.name).toBe('GoneException');
    });

    it('should create LengthRequiredException with correct status code', () => {
      const exception = new LengthRequiredException('Length required');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(411);
      expect(exception.message).toBe('Length required');
      expect(exception.name).toBe('LengthRequiredException');
    });

    it('should create PreconditionFailedException with correct status code', () => {
      const exception = new PreconditionFailedException('Precondition failed');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(412);
      expect(exception.message).toBe('Precondition failed');
      expect(exception.name).toBe('PreconditionFailedException');
    });

    it('should create PayloadTooLargeException with correct status code', () => {
      const exception = new PayloadTooLargeException('Payload too large');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(413);
      expect(exception.message).toBe('Payload too large');
      expect(exception.name).toBe('PayloadTooLargeException');
    });

    it('should create UriTooLongException with correct status code', () => {
      const exception = new UriTooLongException('URI too long');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(414);
      expect(exception.message).toBe('URI too long');
      expect(exception.name).toBe('UriTooLongException');
    });

    it('should create UnsupportedMediaTypeException with correct status code', () => {
      const exception = new UnsupportedMediaTypeException('Unsupported media type');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(415);
      expect(exception.message).toBe('Unsupported media type');
      expect(exception.name).toBe('UnsupportedMediaTypeException');
    });

    it('should create RangeNotSatisfiableException with correct status code', () => {
      const exception = new RangeNotSatisfiableException('Range not satisfiable');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(416);
      expect(exception.message).toBe('Range not satisfiable');
      expect(exception.name).toBe('RangeNotSatisfiableException');
    });

    it('should create ExpectationFailedException with correct status code', () => {
      const exception = new ExpectationFailedException('Expectation failed');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(417);
      expect(exception.message).toBe('Expectation failed');
      expect(exception.name).toBe('ExpectationFailedException');
    });

    it('should create MisdirectedRequestException with correct status code', () => {
      const exception = new MisdirectedRequestException('Misdirected request');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(421);
      expect(exception.message).toBe('Misdirected request');
      expect(exception.name).toBe('MisdirectedRequestException');
    });

    it('should create LockedException with correct status code', () => {
      const exception = new LockedException('Resource locked');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(423);
      expect(exception.message).toBe('Resource locked');
      expect(exception.name).toBe('LockedException');
    });

    it('should create FailedDependencyException with correct status code', () => {
      const exception = new FailedDependencyException('Failed dependency');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(424);
      expect(exception.message).toBe('Failed dependency');
      expect(exception.name).toBe('FailedDependencyException');
    });

    it('should create TooEarlyException with correct status code', () => {
      const exception = new TooEarlyException('Too early');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(425);
      expect(exception.message).toBe('Too early');
      expect(exception.name).toBe('TooEarlyException');
    });

    it('should create UpgradeRequiredException with correct status code', () => {
      const exception = new UpgradeRequiredException('Upgrade required');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(426);
      expect(exception.message).toBe('Upgrade required');
      expect(exception.name).toBe('UpgradeRequiredException');
    });

    it('should create PreconditionRequiredException with correct status code', () => {
      const exception = new PreconditionRequiredException('Precondition required');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(428);
      expect(exception.message).toBe('Precondition required');
      expect(exception.name).toBe('PreconditionRequiredException');
    });

    it('should create RequestHeaderFieldsTooLargeException with correct status code', () => {
      const exception = new RequestHeaderFieldsTooLargeException('Request header fields too large');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(431);
      expect(exception.message).toBe('Request header fields too large');
      expect(exception.name).toBe('RequestHeaderFieldsTooLargeException');
    });

    it('should create UnavailableForLegalReasonsException with correct status code', () => {
      const exception = new UnavailableForLegalReasonsException('Blocked by legal reasons');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(451);
      expect(exception.message).toBe('Blocked by legal reasons');
      expect(exception.name).toBe('UnavailableForLegalReasonsException');
    });
  });

  describe('5xx Server Error Exceptions', () => {
    it('should create InternalServerErrorException with correct status code', () => {
      const exception = new InternalServerErrorException('Server error');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(500);
      expect(exception.message).toBe('Server error');
      expect(exception.name).toBe('InternalServerErrorException');
    });

    it('should create NotImplementedException with correct status code', () => {
      const exception = new NotImplementedException('Not implemented');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(501);
      expect(exception.message).toBe('Not implemented');
      expect(exception.name).toBe('NotImplementedException');
    });

    it('should create BadGatewayException with correct status code', () => {
      const exception = new BadGatewayException('Bad gateway');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(502);
      expect(exception.message).toBe('Bad gateway');
      expect(exception.name).toBe('BadGatewayException');
    });

    it('should create ServiceUnavailableException with correct status code', () => {
      const exception = new ServiceUnavailableException('Service unavailable');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(503);
      expect(exception.message).toBe('Service unavailable');
      expect(exception.name).toBe('ServiceUnavailableException');
    });

    it('should create GatewayTimeoutException with correct status code', () => {
      const exception = new GatewayTimeoutException('Gateway timeout');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(504);
      expect(exception.message).toBe('Gateway timeout');
      expect(exception.name).toBe('GatewayTimeoutException');
    });

    it('should create HttpVersionNotSupportedException with correct status code', () => {
      const exception = new HttpVersionNotSupportedException('HTTP version not supported');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(505);
      expect(exception.message).toBe('HTTP version not supported');
      expect(exception.name).toBe('HttpVersionNotSupportedException');
    });

    it('should create VariantAlsoNegotiatesException with correct status code', () => {
      const exception = new VariantAlsoNegotiatesException('Variant also negotiates');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(506);
      expect(exception.message).toBe('Variant also negotiates');
      expect(exception.name).toBe('VariantAlsoNegotiatesException');
    });

    it('should create InsufficientStorageException with correct status code', () => {
      const exception = new InsufficientStorageException('Insufficient storage');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(507);
      expect(exception.message).toBe('Insufficient storage');
      expect(exception.name).toBe('InsufficientStorageException');
    });

    it('should create LoopDetectedException with correct status code', () => {
      const exception = new LoopDetectedException('Loop detected');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(508);
      expect(exception.message).toBe('Loop detected');
      expect(exception.name).toBe('LoopDetectedException');
    });

    it('should create NotExtendedException with correct status code', () => {
      const exception = new NotExtendedException('Not extended');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(510);
      expect(exception.message).toBe('Not extended');
      expect(exception.name).toBe('NotExtendedException');
    });

    it('should create NetworkAuthenticationRequiredException with correct status code', () => {
      const exception = new NetworkAuthenticationRequiredException('Network auth required');
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.statusCode).toBe(511);
      expect(exception.message).toBe('Network auth required');
      expect(exception.name).toBe('NetworkAuthenticationRequiredException');
    });
  });

  describe('Exception with complex data', () => {
    it('should handle object messages correctly', () => {
      const errorData = {
        code: 'VALIDATION_ERROR',
        field: 'email',
        details: {
          expected: 'valid email format',
          received: 'invalid-email'
        },
        timestamp: new Date().toISOString()
      };

      const exception = new BadRequestException(errorData);
      const body = exception.toBody();

      // When object is passed, toBody() returns the object directly
      expect(body).toEqual(errorData);
      expect(exception.statusCode).toBe(400);
      expect(exception.data).toEqual(errorData);
    });

    it('should handle Error objects correctly', () => {
      const originalError = new Error('Original validation error');
      originalError.stack = 'Error: Original validation error\n    at test';

      const exception = new UnprocessableEntityException(originalError);
      const body = exception.toBody() as ErrorBody;

      expect(body.statusCode).toBe(422);
      expect(body.message).toBe('Original validation error');
    });

    it('should preserve all properties in complex objects', () => {
      const complexError = {
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests',
        retryAfter: 3600,
        limit: 1000,
        remaining: 0,
        resetTime: '2024-01-01T12:00:00Z',
        ip: '127.0.0.1'
      };

      const exception = new TooManyRequestsException(complexError);
      const body = exception.toBody();

      // When object is passed, toBody() returns the object directly
      expect(body).toEqual(complexError);
      expect(exception.statusCode).toBe(429);
      expect(exception.data).toEqual(complexError);
    });
  });

  describe('Exception inheritance chain', () => {
    it('should maintain proper inheritance chain', () => {
      const exception = new BadRequestException('Test error');

      expect(exception instanceof Error).toBe(true);
      expect(exception instanceof HttpException).toBe(true);
      expect(exception instanceof BadRequestException).toBe(true);
    });

    it('should have correct constructor names', () => {
      const exceptions = [
        new BadRequestException('test'),
        new NotFoundException('test'),
        new InternalServerErrorException('test'),
        new TooManyRequestsException('test')
      ];

      expect(exceptions[0].constructor.name).toBe('BadRequestException');
      expect(exceptions[1].constructor.name).toBe('NotFoundException');
      expect(exceptions[2].constructor.name).toBe('InternalServerErrorException');
      expect(exceptions[3].constructor.name).toBe('TooManyRequestsException');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string messages', () => {
      const exception = new BadRequestException('');
      expect(exception.message).toEqual('');
      expect((exception.toBody() as ErrorBody).message).toEqual('');
    });

    it('should handle numeric messages as objects', () => {
      const numericData = { code: 12345, type: 'numeric_error' };
      const exception = new BadRequestException(numericData);
      expect(exception.data).toEqual(numericData);
      expect(exception.toBody()).toEqual(numericData);
    });

    it('should handle boolean data in objects', () => {
      const booleanData = { success: false, retry: true };
      const exception = new BadRequestException(booleanData);
      expect(exception.data).toEqual(booleanData);
      expect(exception.toBody()).toEqual(booleanData);
    });

    it('should handle array data in objects', () => {
      const arrayData = { errors: ['error1', 'error2', 'error3'], count: 3 };
      const exception = new UnprocessableEntityException(arrayData);
      expect(exception.data).toEqual(arrayData);
      expect(exception.toBody()).toEqual(arrayData);
    });
  });
});
