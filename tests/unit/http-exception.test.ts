import { describe, it, expect } from 'bun:test';
import { HttpException } from '../../src/exceptions/http-exception';
import { HttpError } from '../../src/types/http-error';

describe('HttpException', () => {
  it('should create instance with string message', () => {
    const exception = new HttpException(HttpError.BAD_REQUEST, 'Bad Request');
    
    expect(exception.statusCode).toBe(400);
    expect(exception.message).toBe('Bad Request');
    expect(exception.name).toBe('HttpException');
    expect(exception instanceof Error).toBe(true);
    expect(exception instanceof HttpException).toBe(true);
  });

  it('should create instance with object message', () => {
    const messageObject = {
      error: 'VALIDATION_FAILED',
      field: 'email',
      details: 'Invalid email format'
    };
    
    const exception = new HttpException(HttpError.BAD_REQUEST, messageObject);
    
    expect(exception.statusCode).toBe(400);
    expect(exception.data).toEqual(messageObject);
  });

  it('should create instance with Error object', () => {
    const originalError = new Error('Original error message');
    const exception = new HttpException(HttpError.INTERNAL_SERVER_ERROR, originalError);
    
    expect(exception.statusCode).toBe(500);
    expect(exception.message).toBe('Original error message');
  });

  it('should return correct body for string message', () => {
    const exception = new HttpException(HttpError.BAD_REQUEST, 'Bad Request');
    const body = exception.toBody();
    
    expect(body).toEqual({
      statusCode: 400,
      message: 'Bad Request'
    });
  });

  it('should return correct body for object message', () => {
    const messageObject = {
      error: 'VALIDATION_FAILED',
      field: 'email'
    };
    
    const exception = new HttpException(HttpError.BAD_REQUEST, messageObject);
    const body = exception.toBody();
    
    expect(body).toEqual(messageObject);
  });

  it('should return correct body for Error object message', () => {
    const originalError = new Error('Original error');
    const exception = new HttpException(HttpError.INTERNAL_SERVER_ERROR, originalError);
    const body = exception.toBody();
    
    expect(body).toEqual({
      statusCode: 500,
      message: 'Original error'
    });
  });

  it('should handle null message', () => {
    const exception = new HttpException(HttpError.BAD_REQUEST, null as any);
    const body = exception.toBody();
    
    expect(body).toEqual({
      statusCode: 400,
      message: 'Bad Request'
    });
  });

  it('should handle undefined message', () => {
    const exception = new HttpException(HttpError.BAD_REQUEST, undefined as any);
    const body = exception.toBody();
    
    expect(body).toEqual({
      statusCode: 400,
      message: 'Bad Request'
    });
  });

  it('should preserve stack trace', () => {
    const exception = new HttpException(HttpError.INTERNAL_SERVER_ERROR, 'Internal Error');
    
    expect(exception.stack).toBeDefined();
    expect(typeof exception.stack).toBe('string');
    expect(exception.stack).toContain('HttpException');
  });

  it('should be serializable to JSON', () => {
    const exception = new HttpException(HttpError.BAD_REQUEST, { error: 'TEST_ERROR' });
    const serialized = JSON.stringify(exception);
    const parsed = JSON.parse(serialized);
    
    expect(parsed.statusCode).toBe(400);
    expect(parsed.data).toEqual({ error: 'TEST_ERROR' });
  });
});
