import { Elysia } from 'elysia';
import {
  httpExceptionPlugin,
  // 4xx Client Error Exceptions
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
  // 5xx Server Error Exceptions
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
} from 'elysia-http-exception';

const app = new Elysia()
  .use(httpExceptionPlugin())
  .get('/', () => 'Elysia HTTP Exception Examples - Try different endpoints to see various errors!')

  // 4xx Client Errors
  .get('/400', () => {
    throw new BadRequestException('Invalid request format');
  })
  .get('/401', () => {
    throw new UnauthorizedException('Authentication required');
  })
  .get('/402', () => {
    throw new PaymentRequiredException('Payment is required to access this resource');
  })
  .get('/403', () => {
    throw new ForbiddenException('You do not have permission to access this resource');
  })
  .get('/404', () => {
    throw new NotFoundException('The requested resource was not found');
  })
  .get('/405', () => {
    throw new MethodNotAllowedException('This HTTP method is not allowed for this endpoint');
  })
  .get('/406', () => {
    throw new NotAcceptableException('The requested format is not acceptable');
  })
  .get('/408', () => {
    throw new RequestTimeoutException('Request timeout occurred');
  })
  .get('/409', () => {
    throw new ConflictException('Resource conflict detected');
  })
  .get('/410', () => {
    throw new GoneException('This resource is no longer available');
  })
  .get('/411', () => {
    throw new LengthRequiredException('Content-Length header is required');
  })
  .get('/412', () => {
    throw new PreconditionFailedException('Precondition in request headers failed');
  })
  .get('/413', () => {
    throw new PayloadTooLargeException('Request payload is too large');
  })
  .get('/414', () => {
    throw new UriTooLongException('The URI provided was too long');
  })
  .get('/415', () => {
    throw new UnsupportedMediaTypeException('Unsupported media type');
  })
  .get('/416', () => {
    throw new RangeNotSatisfiableException('Requested range not satisfiable');
  })
  .get('/417', () => {
    throw new ExpectationFailedException('Expectation failed');
  })
  .get('/418', () => {
    throw new ImATeapotException("I'm a teapot - cannot brew coffee!");
  })
  .get('/421', () => {
    throw new MisdirectedRequestException('Request was misdirected');
  })
  .get('/422', () => {
    throw new UnprocessableEntityException(
      'The request was well-formed but contains semantic errors',
    );
  })
  .get('/423', () => {
    throw new LockedException('The resource is locked');
  })
  .get('/424', () => {
    throw new FailedDependencyException('Request failed due to dependency failure');
  })
  .get('/425', () => {
    throw new TooEarlyException('Too early to process this request');
  })
  .get('/426', () => {
    throw new UpgradeRequiredException('Client should upgrade to different protocol');
  })
  .get('/428', () => {
    throw new PreconditionRequiredException('Precondition is required');
  })
  .get('/429', () => {
    throw new TooManyRequestsException('Too many requests - rate limit exceeded');
  })
  .get('/431', () => {
    throw new RequestHeaderFieldsTooLargeException('Request header fields too large');
  })
  .get('/451', () => {
    throw new UnavailableForLegalReasonsException('Unavailable for legal reasons');
  })

  // 5xx Server Errors
  .get('/500', () => {
    throw new InternalServerErrorException('An internal server error occurred');
  })
  .get('/501', () => {
    throw new NotImplementedException('This functionality is not implemented');
  })
  .get('/502', () => {
    throw new BadGatewayException('Bad gateway response from upstream server');
  })
  .get('/503', () => {
    throw new ServiceUnavailableException('Service temporarily unavailable');
  })
  .get('/504', () => {
    throw new GatewayTimeoutException('Gateway timeout from upstream server');
  })
  .get('/505', () => {
    throw new HttpVersionNotSupportedException('HTTP version not supported');
  })
  .get('/506', () => {
    throw new VariantAlsoNegotiatesException('Variant also negotiates');
  })
  .get('/507', () => {
    throw new InsufficientStorageException('Insufficient storage space');
  })
  .get('/508', () => {
    throw new LoopDetectedException('Infinite loop detected');
  })
  .get('/510', () => {
    throw new NotExtendedException('Further extensions are required');
  })
  .get('/511', () => {
    throw new NetworkAuthenticationRequiredException('Network authentication required');
  })

  // Examples with custom data/objects
  .get('/custom-error', () => {
    throw new BadRequestException({
      error: 'VALIDATION_FAILED',
      details: {
        field: 'email',
        message: 'Invalid email format',
      },
      timestamp: new Date().toISOString(),
    });
  })

  .get('/custom-string', () => {
    throw new NotFoundException('User with ID "12345" not found in the system');
  })

  .get('/custom-error-object', () => {
    const validationError = new Error('Validation failed for input data');
    throw new UnprocessableEntityException(validationError);
  })

  // Practical example - User management
  .get('/users/:id', ({ params }) => {
    const userId = parseInt(params.id);

    if (isNaN(userId)) {
      throw new BadRequestException('User ID must be a valid number');
    }

    if (userId < 1) {
      throw new BadRequestException('User ID must be positive');
    }

    if (userId === 404) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (userId === 403) {
      throw new ForbiddenException('You do not have permission to view this user');
    }

    return { id: userId, name: `User ${userId}`, email: `user${userId}@example.com` };
  })

  // API rate limiting example
  .get('/api/data', ({ request }) => {
    const rateLimitExceeded = Math.random() > 0.7; // Simulate rate limiting

    if (rateLimitExceeded) {
      throw new TooManyRequestsException({
        message: 'Rate limit exceeded',
        retryAfter: 60,
        limit: 100,
        remaining: 0,
      });
    }

    return { data: 'Some API data', timestamp: Date.now() };
  })

  // Database connection example
  .get('/database/status', () => {
    const dbConnected = Math.random() > 0.3; // Simulate database connection

    if (!dbConnected) {
      throw new ServiceUnavailableException('Database connection failed - please try again later');
    }

    return { status: 'Database is healthy', connections: 25 };
  })

  .listen(3000);

console.log(`🚀 Server is running at http://localhost:3000`);

console.log('\n📚 Available endpoints:');
console.log('GET / - Welcome message');
console.log('\n🔴 4xx Client Errors:');
console.log('GET /400, /401, /402, /403, /404, /405, /406, /408, /409, /410');
console.log('GET /411, /412, /413, /414, /415, /416, /417, /418, /421, /422');
console.log('GET /423, /424, /425, /426, /428, /429, /431, /451');
console.log('\n🔥 5xx Server Errors:');
console.log('GET /500, /501, /502, /503, /504, /505, /506, /507, /508, /510, /511');
console.log('\n🎯 Custom Examples:');
console.log('GET /custom-error - Custom error with object data');
console.log('GET /custom-string - Custom error with string message');
console.log('GET /custom-error-object - Custom error with Error object');
console.log('\n💡 Practical Examples:');
console.log('GET /users/:id - User management with validation');
console.log('GET /api/data - API rate limiting example');
console.log('GET /database/status - Database connection example');
