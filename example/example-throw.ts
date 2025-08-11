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

  // Authentication examples
  .get('/auth/profile', ({ headers }) => {
    const authHeader = headers['authorization'];
    
    if (!authHeader) {
      throw new UnauthorizedException({
        error: 'MISSING_AUTH_HEADER',
        message: 'Authorization header is required',
        requiredFormat: 'Bearer <token>'
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException({
        error: 'INVALID_AUTH_FORMAT', 
        message: 'Invalid authorization format',
        received: authHeader.substring(0, 20) + '...',
        expected: 'Bearer <token>'
      });
    }

    const token = authHeader.substring(7);
    if (token === 'invalid') {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (token === 'expired') {
      throw new UnauthorizedException({
        error: 'TOKEN_EXPIRED',
        message: 'Authentication token has expired',
        expiredAt: new Date(Date.now() - 3600000).toISOString()
      });
    }

    return { user: { id: 1, name: 'John Doe', email: 'john@example.com' } };
  })

  // File upload examples
  .post('/upload/avatar', ({ headers }) => {
    const contentType = headers['content-type'];
    
    if (!contentType) {
      throw new BadRequestException('Content-Type header is required');
    }

    if (!contentType.startsWith('multipart/form-data')) {
      throw new UnsupportedMediaTypeException({
        error: 'INVALID_CONTENT_TYPE',
        message: 'Only multipart/form-data is supported for file uploads',
        received: contentType,
        supported: ['multipart/form-data']
      });
    }

    const contentLength = parseInt(headers['content-length'] || '0');
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (contentLength > maxSize) {
      throw new PayloadTooLargeException({
        error: 'FILE_TOO_LARGE',
        message: `File size exceeds maximum allowed size`,
        maxSize: `${maxSize / 1024 / 1024}MB`,
        receivedSize: `${(contentLength / 1024 / 1024).toFixed(2)}MB`
      });
    }

    // Simulate processing
    if (Math.random() > 0.8) {
      throw new InternalServerErrorException('File processing failed');
    }

    return { message: 'Avatar uploaded successfully', fileSize: contentLength };
  })

  // E-commerce examples
  .post('/cart/checkout', ({ body }) => {
    const data = body as any;
    
    if (!data?.items || !Array.isArray(data.items) || data.items.length === 0) {
      throw new BadRequestException({
        error: 'EMPTY_CART',
        message: 'Cart cannot be empty for checkout'
      });
    }

    // Check inventory
    const outOfStockItem = data.items.find((item: any) => item.id === 'out-of-stock');
    if (outOfStockItem) {
      throw new ConflictException({
        error: 'ITEM_OUT_OF_STOCK',
        message: 'Some items in your cart are no longer available',
        unavailableItems: [outOfStockItem]
      });
    }

    // Payment simulation
    if (!data.paymentMethod) {
      throw new PaymentRequiredException({
        error: 'PAYMENT_METHOD_REQUIRED',
        message: 'Payment method is required for checkout',
        acceptedMethods: ['credit_card', 'paypal', 'bank_transfer']
      });
    }

    if (data.paymentMethod === 'insufficient_funds') {
      throw new PaymentRequiredException({
        error: 'INSUFFICIENT_FUNDS',
        message: 'Insufficient funds for this transaction',
        required: data.total || 100,
        available: 50
      });
    }

    return { 
      message: 'Checkout successful', 
      orderId: 'order-' + Date.now(),
      total: data.total || 100
    };
  })

  // Resource management examples
  .post('/resources/create', ({ body }) => {
    const data = body as any;

    if (!data?.name) {
      throw new UnprocessableEntityException({
        error: 'VALIDATION_ERROR',
        message: 'Resource name is required',
        field: 'name'
      });
    }

    // Simulate resource already exists
    if (data.name === 'existing-resource') {
      throw new ConflictException({
        error: 'RESOURCE_EXISTS',
        message: `Resource with name '${data.name}' already exists`,
        conflictingField: 'name',
        suggestion: 'Use a different name or update the existing resource'
      });
    }

    // Simulate dependency check
    if (data.dependencies && data.dependencies.includes('missing-dep')) {
      throw new FailedDependencyException({
        error: 'MISSING_DEPENDENCY',
        message: 'Required dependency is not available',
        missingDependencies: ['missing-dep'],
        availableDependencies: ['dep1', 'dep2']
      });
    }

    return { message: 'Resource created successfully', id: 'res-' + Date.now() };
  })

  // API versioning examples
  .get('/v1/deprecated-endpoint', () => {
    throw new GoneException({
      error: 'ENDPOINT_DEPRECATED',
      message: 'This endpoint has been deprecated and is no longer available',
      deprecatedSince: '2024-01-01',
      alternativeEndpoint: '/v2/new-endpoint',
      documentationUrl: 'https://docs.example.com/migration-guide'
    });
  })

  // Content negotiation examples
  .get('/data/export', ({ headers }) => {
    const acceptHeader = headers['accept'];
    
    if (!acceptHeader) {
      throw new BadRequestException('Accept header is required');
    }

    const supportedTypes = ['application/json', 'application/xml', 'text/csv'];
    const isSupported = supportedTypes.some(type => acceptHeader.includes(type));
    
    if (!isSupported) {
      throw new NotAcceptableException({
        error: 'UNSUPPORTED_MEDIA_TYPE',
        message: 'Requested media type is not supported',
        requested: acceptHeader,
        supported: supportedTypes
      });
    }

    return { message: 'Data export prepared', format: acceptHeader };
  })

  // Network and proxy examples
  .get('/proxy/external-service', () => {
    // Simulate external service calls
    const scenario = Math.random();
    
    if (scenario < 0.3) {
      throw new BadGatewayException({
        error: 'UPSTREAM_ERROR',
        message: 'External service returned invalid response',
        upstreamService: 'external-api.example.com',
        statusCode: 502
      });
    }
    
    if (scenario < 0.6) {
      throw new GatewayTimeoutException({
        error: 'UPSTREAM_TIMEOUT',
        message: 'External service did not respond in time',
        upstreamService: 'external-api.example.com',
        timeout: '30s'
      });
    }

    if (scenario < 0.8) {
      throw new ServiceUnavailableException({
        error: 'UPSTREAM_UNAVAILABLE',
        message: 'External service is currently unavailable',
        upstreamService: 'external-api.example.com',
        retryAfter: '300s'
      });
    }

    return { message: 'External service response', data: 'success' };
  })

  // Security examples
  .post('/admin/sensitive-action', ({ headers }) => {
    // Simulate IP-based restrictions
    const clientIp = headers['x-forwarded-for'] || '127.0.0.1';
    const blockedIps = ['192.168.1.100', '10.0.0.50'];
    
    if (blockedIps.includes(clientIp)) {
      throw new ForbiddenException({
        error: 'IP_BLOCKED',
        message: 'Access denied from this IP address',
        clientIp,
        reason: 'Security policy violation'
      });
    }

    // Simulate legal compliance
    const userCountry = headers['cf-ipcountry'] || 'US';
    const restrictedCountries = ['XX', 'YY'];
    
    if (restrictedCountries.includes(userCountry)) {
      throw new UnavailableForLegalReasonsException({
        error: 'GEOGRAPHIC_RESTRICTION',
        message: 'This service is not available in your region',
        country: userCountry,
        reason: 'Legal compliance requirements'
      });
    }

    return { message: 'Sensitive action completed successfully' };
  })

  // WebSocket upgrade simulation
  .get('/ws/connect', ({ headers }) => {
    const upgrade = headers['upgrade'];
    const connection = headers['connection'];
    
    if (upgrade !== 'websocket' || !connection?.toLowerCase().includes('upgrade')) {
      throw new UpgradeRequiredException({
        error: 'WEBSOCKET_UPGRADE_REQUIRED',
        message: 'This endpoint requires WebSocket upgrade',
        requiredHeaders: {
          'Upgrade': 'websocket',
          'Connection': 'Upgrade'
        }
      });
    }

    return { message: 'WebSocket upgrade would happen here' };
  })

  // Cookie validation examples
  .get('/session/validate', ({ headers }) => {
    const cookieHeader = headers['cookie'];
    
    if (!cookieHeader) {
      throw new UnauthorizedException({
        error: 'MISSING_SESSION_COOKIE',
        message: 'Session cookie is required'
      });
    }

    if (!cookieHeader.includes('sessionId=')) {
      throw new UnauthorizedException({
        error: 'INVALID_SESSION_COOKIE',
        message: 'Valid session cookie is required'
      });
    }

    // Simulate invalid signature (would be handled by Elysia's INVALID_COOKIE_SIGNATURE)
    if (cookieHeader.includes('invalid-signature')) {
      // This would trigger Elysia's built-in cookie validation
      throw new BadRequestException('Invalid cookie signature detected');
    }

    return { message: 'Session is valid' };
  })

  // Request parsing examples (would trigger Elysia's PARSE error)
  .post('/data/json', ({ body }) => {
    // This would be handled by Elysia's built-in JSON parsing
    // Invalid JSON would trigger PARSE error automatically
    return { message: 'JSON parsed successfully', received: body };
  })

  // Validation examples (would trigger Elysia's VALIDATION error)
  .post('/users/create', ({ body }) => {
    const data = body as any;
    
    // Manual validation that mimics Elysia's schema validation
    const errors = [];
    
    if (!data?.email) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push({ field: 'email', message: 'Invalid email format' });
    }
    
    if (!data?.password) {
      errors.push({ field: 'password', message: 'Password is required' });
    } else if (data.password.length < 8) {
      errors.push({ field: 'password', message: 'Password must be at least 8 characters' });
    }
    
    if (!data?.age) {
      errors.push({ field: 'age', message: 'Age is required' });
    } else if (typeof data.age !== 'number' || data.age < 18) {
      errors.push({ field: 'age', message: 'Age must be a number and at least 18' });
    }

    if (errors.length > 0) {
      throw new UnprocessableEntityException({
        error: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        errors
      });
    }

    return { message: 'User created successfully', user: { email: data.email, age: data.age } };
  })

  // Default Elysia error examples (these will be caught by the plugin)
  .get('/trigger/not-found-error', () => {
    // This will trigger Elysia's built-in NOT_FOUND handling
    // by trying to access a route that doesn't exist from within the handler
    throw new Error('This simulates an internal route resolution error');
  })

  .get('/trigger/unknown-error', () => {
    // This will trigger the UNKNOWN error handling in the plugin
    throw new Error('This is an unhandled error type');
  })

  .listen(3000);

console.log(`🚀 Throw Examples Server is running at http://localhost:3000`);

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
console.log('\n🔐 Authentication Examples:');
console.log('GET /auth/profile - Authentication with Bearer token (try: valid, invalid, expired)');
console.log('GET /session/validate - Session cookie validation');
console.log('\n📁 File Upload Examples:');
console.log('POST /upload/avatar - File upload with size and type validation');
console.log('\n🛒 E-commerce Examples:');
console.log('POST /cart/checkout - Checkout with inventory and payment validation');
console.log('\n🏗️ Resource Management:');
console.log('POST /resources/create - Resource creation with dependency checking');
console.log('\n🌐 Network & Proxy Examples:');
console.log('GET /proxy/external-service - External service proxy simulation');
console.log('\n📄 Content & API Examples:');
console.log('GET /data/export - Content negotiation example');
console.log('GET /v1/deprecated-endpoint - Deprecated API endpoint');
console.log('\n🔒 Security Examples:');
console.log('POST /admin/sensitive-action - IP blocking and geo-restrictions');
console.log('\n🔌 Protocol Examples:');
console.log('GET /ws/connect - WebSocket upgrade requirement');
console.log('\n📝 Data Processing:');
console.log('POST /data/json - JSON parsing (send invalid JSON to trigger PARSE error)');
console.log('POST /users/create - User validation (try incomplete data)');
console.log('\n⚠️ Elysia Error Triggers:');
console.log('GET /trigger/not-found-error - Trigger NOT_FOUND handling');
console.log('GET /trigger/unknown-error - Trigger UNKNOWN error handling');

console.log('\n💡 Test Examples with curl:');
console.log('# Basic errors:');
console.log('curl http://localhost:3000/404');
console.log('curl http://localhost:3000/500');
console.log('\n# Authentication (needs Authorization header):');
console.log('curl http://localhost:3000/auth/profile');
console.log('curl -H "Authorization: Bearer invalid" http://localhost:3000/auth/profile');
console.log('curl -H "Authorization: Bearer expired" http://localhost:3000/auth/profile');
console.log('\n# File upload simulation:');
console.log('curl -X POST -H "Content-Type: application/json" http://localhost:3000/upload/avatar');
console.log('curl -X POST -H "Content-Type: multipart/form-data" -H "Content-Length: 6000000" http://localhost:3000/upload/avatar');
console.log('\n# E-commerce checkout:');
console.log('curl -X POST http://localhost:3000/cart/checkout -H "Content-Type: application/json" -d \'{"items":[]}\'')
console.log('curl -X POST http://localhost:3000/cart/checkout -H "Content-Type: application/json" -d \'{"items":[{"id":"out-of-stock"}]}\'')
console.log('\n# User validation:');
console.log('curl -X POST http://localhost:3000/users/create -H "Content-Type: application/json" -d \'{"email":"invalid"}\'')
console.log('curl -X POST http://localhost:3000/users/create -H "Content-Type: application/json" -d \'{"email":"valid@example.com","password":"password123","age":25}\'')
console.log('\n🔄 Compare with decorator examples at: http://localhost:3001');
