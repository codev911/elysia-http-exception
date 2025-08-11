import { describe, expect, it } from 'bun:test';
import { Elysia } from 'elysia';
import { httpExceptionPlugin } from '../../src/http-exception-plugin';
import { 
  HttpException, 
  BadRequestException, 
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException
} from '../../src';

describe('HTTP Exception Plugin', () => {
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

  it('should handle HttpException in decorator', () => {
    const plugin = httpExceptionPlugin();
    const httpException = plugin.decorator.httpException;
    
    const error = new BadRequestException('Invalid input');
    const response = httpException(error);
    
    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(400);
  });

  it('should handle generic errors in decorator', () => {
    const plugin = httpExceptionPlugin();
    const httpException = plugin.decorator.httpException;
    
    const error = new Error('Some error');
    const response = httpException(error);
    
    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(500);
  });

  it('should handle non-error values in decorator', () => {
    const plugin = httpExceptionPlugin();
    const httpException = plugin.decorator.httpException;
    
    const response = httpException('Some error message');
    
    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(500);
  });

  it('should create plugin with correct name', () => {
    const plugin = httpExceptionPlugin();
    expect(plugin.config.name).toBe('elysia-http-exception');
  });
});
