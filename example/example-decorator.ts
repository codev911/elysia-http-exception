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
  .get('/', () => 'Elysia HTTP Exception Decorator Examples - Using httpException decorator instead of throw')

  // Example 1: Using decorator with BadRequestException
  .get('/decorator/400', ({ httpException }) => {
    return httpException(new BadRequestException('Invalid request format using decorator'));
  })

  // Example 2: Using decorator with NotFoundException
  .get('/decorator/404', ({ httpException }) => {
    return httpException(new NotFoundException('Resource not found using decorator'));
  })

  // Example 3: Using decorator with UnauthorizedException
  .get('/decorator/401', ({ httpException }) => {
    return httpException(new UnauthorizedException('Authentication required using decorator'));
  })

  // Example 4: Using decorator with ForbiddenException
  .get('/decorator/403', ({ httpException }) => {
    return httpException(new ForbiddenException('Access denied using decorator'));
  })

  // Example 5: Using decorator with InternalServerErrorException
  .get('/decorator/500', ({ httpException }) => {
    return httpException(new InternalServerErrorException('Server error using decorator'));
  })

  // Example 6: Using decorator with custom object data
  .get('/decorator/custom-object', ({ httpException }) => {
    return httpException(new BadRequestException({
      error: 'VALIDATION_FAILED',
      details: {
        field: 'email',
        message: 'Invalid email format',
        code: 'EMAIL_INVALID'
      },
      timestamp: new Date().toISOString(),
      requestId: 'req-123456'
    }));
  })

  // Example 7: Using decorator with Error object
  .get('/decorator/custom-error', ({ httpException }) => {
    const validationError = new Error('Custom validation failed');
    return httpException(new UnprocessableEntityException(validationError));
  })

  // Example 8: User management with decorator
  .get('/decorator/users/:id', ({ params, httpException }) => {
    const userId = parseInt(params.id);

    if (isNaN(userId)) {
      return httpException(new BadRequestException('User ID must be a valid number'));
    }

    if (userId < 1) {
      return httpException(new BadRequestException('User ID must be positive'));
    }

    if (userId === 404) {
      return httpException(new NotFoundException(`User with ID ${userId} not found`));
    }

    if (userId === 403) {
      return httpException(new ForbiddenException('You do not have permission to view this user'));
    }

    if (userId === 500) {
      return httpException(new InternalServerErrorException('Database connection failed'));
    }

    return { id: userId, name: `User ${userId}`, email: `user${userId}@example.com` };
  })

  // Example 9: API validation with decorator
  .post('/decorator/validate', ({ body, httpException }) => {
    if (!body || typeof body !== 'object') {
      return httpException(new BadRequestException('Request body is required'));
    }

    const data = body as any;

    if (!data.name) {
      return httpException(new UnprocessableEntityException({
        error: 'VALIDATION_ERROR',
        field: 'name',
        message: 'Name is required'
      }));
    }

    if (!data.email) {
      return httpException(new UnprocessableEntityException({
        error: 'VALIDATION_ERROR',
        field: 'email',
        message: 'Email is required'
      }));
    }

    if (!data.email.includes('@')) {
      return httpException(new UnprocessableEntityException({
        error: 'VALIDATION_ERROR',
        field: 'email',
        message: 'Invalid email format'
      }));
    }

    return {
      message: 'Data validated successfully',
      data: {
        name: data.name,
        email: data.email
      }
    };
  })

  // Example 10: Rate limiting with decorator
  .get('/decorator/api/data', ({ httpException }) => {
    const rateLimitExceeded = Math.random() > 0.7; // Simulate rate limiting

    if (rateLimitExceeded) {
      return httpException(new TooManyRequestsException({
        message: 'Rate limit exceeded',
        retryAfter: 60,
        limit: 100,
        remaining: 0
      }));
    }

    return { data: 'Some API data', timestamp: Date.now() };
  })

  // Example 11: File upload simulation with decorator
  .post('/decorator/upload', ({ httpException }) => {
    const fileSize = Math.random() * 10; // MB
    const maxSize = 5; // MB

    if (fileSize > maxSize) {
      return httpException(new PayloadTooLargeException({
        message: `File size ${fileSize.toFixed(2)}MB exceeds maximum ${maxSize}MB`,
        maxSize,
        actualSize: fileSize
      }));
    }

    // Simulate unsupported file type
    const isUnsupportedType = Math.random() > 0.8;
    if (isUnsupportedType) {
      return httpException(new UnsupportedMediaTypeException('Only image files are allowed'));
    }

    return {
      message: 'File uploaded successfully',
      size: `${fileSize.toFixed(2)}MB`,
      processed: true
    };
  })

  // Example 12: Database connection with decorator
  .get('/decorator/database/status', ({ httpException }) => {
    const dbConnected = Math.random() > 0.3; // Simulate database connection

    if (!dbConnected) {
      return httpException(new ServiceUnavailableException('Database connection failed - please try again later'));
    }

    return { status: 'Database is healthy', connections: 25 };
  })

  // Example 13: Payment processing with decorator
  .post('/decorator/payment', ({ httpException }) => {
    const hasPayment = Math.random() > 0.5;

    if (!hasPayment) {
      return httpException(new PaymentRequiredException({
        message: 'Payment is required to access this resource',
        amount: 9.99,
        currency: 'USD',
        paymentUrl: '/payment/checkout'
      }));
    }

    return { message: 'Payment processed successfully', transactionId: 'txn-123456' };
  })

  // Example 14: Resource conflict with decorator
  .post('/decorator/resources', ({ httpException }) => {
    const hasConflict = Math.random() > 0.6;

    if (hasConflict) {
      return httpException(new ConflictException({
        message: 'Resource already exists',
        conflictingResource: 'user-email-john@example.com',
        suggestion: 'Use PUT to update existing resource'
      }));
    }

    return { message: 'Resource created successfully', id: 'res-123456' };
  })

  // Example 15: Teapot exception with decorator (RFC 2324)
  .get('/decorator/coffee', ({ httpException }) => {
    return httpException(new ImATeapotException("I'm a teapot, cannot brew coffee! Try tea instead."));
  })

  // Example 16: Async operation with decorator
  .get('/decorator/async-operation', async ({ httpException }) => {
    try {
      // Simulate async operation
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.5) {
            reject(new Error('Async operation failed'));
          } else {
            resolve('success');
          }
        }, 100);
      });

      return { message: 'Async operation completed successfully' };
    } catch (error) {
      if (error instanceof Error) return httpException(new InternalServerErrorException(error));
      else return httpException(new InternalServerErrorException('Unknown error during async operation'));
    }
  })

  // Example 17: Comprehensive form validation with decorator
  .post('/decorator/form/register', ({ body, httpException }) => {
    const data = body as any;
    const errors = [];
    
    // Email validation
    if (!data?.email) {
      errors.push({ field: 'email', message: 'Email is required', code: 'REQUIRED' });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push({ field: 'email', message: 'Invalid email format', code: 'INVALID_FORMAT' });
    } else if (data.email === 'admin@example.com') {
      return httpException(new ConflictException({
        error: 'EMAIL_ALREADY_EXISTS',
        message: 'Email address is already registered',
        field: 'email',
        suggestion: 'Try logging in or use forgot password'
      }));
    }
    
    // Password validation
    if (!data?.password) {
      errors.push({ field: 'password', message: 'Password is required', code: 'REQUIRED' });
    } else {
      if (data.password.length < 8) {
        errors.push({ field: 'password', message: 'Password must be at least 8 characters', code: 'TOO_SHORT' });
      }
      if (!/(?=.*[a-z])/.test(data.password)) {
        errors.push({ field: 'password', message: 'Password must contain lowercase letter', code: 'MISSING_LOWERCASE' });
      }
      if (!/(?=.*[A-Z])/.test(data.password)) {
        errors.push({ field: 'password', message: 'Password must contain uppercase letter', code: 'MISSING_UPPERCASE' });
      }
      if (!/(?=.*\d)/.test(data.password)) {
        errors.push({ field: 'password', message: 'Password must contain number', code: 'MISSING_NUMBER' });
      }
    }
    
    // Age validation
    if (!data?.age) {
      errors.push({ field: 'age', message: 'Age is required', code: 'REQUIRED' });
    } else if (typeof data.age !== 'number') {
      errors.push({ field: 'age', message: 'Age must be a number', code: 'INVALID_TYPE' });
    } else if (data.age < 13) {
      return httpException(new ForbiddenException({
        error: 'AGE_RESTRICTION',
        message: 'Must be at least 13 years old to register',
        minimumAge: 13,
        providedAge: data.age
      }));
    } else if (data.age > 120) {
      errors.push({ field: 'age', message: 'Age seems unrealistic', code: 'UNREALISTIC_VALUE' });
    }

    // Terms acceptance
    if (!data?.acceptTerms) {
      return httpException(new BadRequestException({
        error: 'TERMS_NOT_ACCEPTED',
        message: 'You must accept the terms and conditions',
        field: 'acceptTerms'
      }));
    }

    if (errors.length > 0) {
      return httpException(new UnprocessableEntityException({
        error: 'VALIDATION_ERRORS',
        message: 'Registration form contains validation errors',
        errors,
        totalErrors: errors.length
      }));
    }

    return {
      message: 'Registration successful',
      user: {
        email: data.email,
        age: data.age,
        registeredAt: new Date().toISOString()
      }
    };
  })

  // Example 18: Multi-step process with decorator
  .post('/decorator/process/multi-step', ({ body, httpException }) => {
    const data = body as any;
    const step = data?.step || 1;

    switch (step) {
      case 1:
        if (!data?.personalInfo) {
          return httpException(new BadRequestException({
            error: 'MISSING_PERSONAL_INFO',
            message: 'Personal information is required for step 1',
            requiredFields: ['firstName', 'lastName', 'dateOfBirth']
          }));
        }
        return { message: 'Step 1 completed', nextStep: 2 };

      case 2:
        if (!data?.contactInfo) {
          return httpException(new BadRequestException({
            error: 'MISSING_CONTACT_INFO',
            message: 'Contact information is required for step 2',
            requiredFields: ['email', 'phone', 'address']
          }));
        }
        // Simulate external verification service
        if (Math.random() > 0.7) {
          return httpException(new ServiceUnavailableException({
            error: 'VERIFICATION_SERVICE_DOWN',
            message: 'Email verification service is temporarily unavailable',
            retryAfter: '300s',
            step: 2
          }));
        }
        return { message: 'Step 2 completed', nextStep: 3 };

      case 3:
        if (!data?.paymentInfo) {
          return httpException(new PaymentRequiredException({
            error: 'PAYMENT_INFO_REQUIRED',
            message: 'Payment information is required for step 3',
            acceptedPaymentMethods: ['credit_card', 'debit_card', 'paypal']
          }));
        }
        return { message: 'All steps completed successfully', processId: 'proc-' + Date.now() };

      default:
        return httpException(new BadRequestException({
          error: 'INVALID_STEP',
          message: `Invalid step: ${step}`,
          validSteps: [1, 2, 3],
          currentStep: step
        }));
    }
  })

  // Example 19: System maintenance mode with decorator
  .get('/decorator/system/status', ({ headers, httpException }) => {
    const maintenanceMode = Math.random() > 0.8; // 20% chance of maintenance
    const systemOverloaded = Math.random() > 0.9; // 10% chance of overload
    
    if (maintenanceMode) {
      return httpException(new ServiceUnavailableException({
        error: 'MAINTENANCE_MODE',
        message: 'System is currently under maintenance',
        maintenanceStarted: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
        estimatedCompletion: new Date(Date.now() + 1800000).toISOString(), // 30 min from now
        statusPageUrl: 'https://status.example.com'
      }));
    }
    
    if (systemOverloaded) {
      return httpException(new ServiceUnavailableException({
        error: 'SYSTEM_OVERLOADED',
        message: 'System is currently experiencing high load',
        retryAfter: '60s',
        currentLoad: '95%',
        recommendedAction: 'Please try again in a few minutes'
      }));
    }

    return {
      status: 'operational',
      uptime: '99.9%',
      responseTime: '120ms',
      activeConnections: 1247
    };
  })

  // Example 20: Default Elysia error handling examples
  .post('/decorator/elysia-errors/parse-error', ({ body, httpException }) => {
    // This endpoint will receive invalid JSON and the plugin will handle PARSE error
    return { message: 'JSON parsed successfully', data: body };
  })

  .get('/decorator/elysia-errors/not-found-simulation', ({ httpException }) => {
    // Simulate a scenario that would trigger NOT_FOUND
    return httpException(new NotFoundException({
      error: 'RESOURCE_NOT_FOUND',
      message: 'The requested resource does not exist',
      resourceType: 'simulation',
      suggestion: 'Check the URL and try again'
    }));
  })

  .get('/decorator/elysia-errors/unknown-simulation', ({ httpException }) => {
    // Simulate an unknown error that would be handled by the plugin's fallback
    const error = new Error('Simulated unknown error');
    error.name = 'UnknownError';
    return httpException(new InternalServerErrorException(error));
  })

  // Additional examples for unused exceptions
  
  // MethodNotAllowedException (405)
  .post('/decorator/method-not-allowed', ({ httpException }) => {
    return httpException(new MethodNotAllowedException({
      error: 'METHOD_NOT_ALLOWED',
      message: 'This endpoint only accepts GET requests',
      allowedMethods: ['GET'],
      receivedMethod: 'POST'
    }));
  })

  // NotAcceptableException (406)
  .get('/decorator/not-acceptable', ({ headers, httpException }) => {
    const accept = headers['accept'] || 'text/html';
    if (!accept.includes('application/json')) {
      return httpException(new NotAcceptableException({
        error: 'NOT_ACCEPTABLE',
        message: 'This endpoint only provides JSON responses',
        clientAccepts: accept,
        serverProvides: ['application/json']
      }));
    }
    return { message: 'JSON response' };
  })

  // RequestTimeoutException (408)
  .get('/decorator/timeout', ({ httpException }) => {
    return httpException(new RequestTimeoutException({
      error: 'REQUEST_TIMEOUT',
      message: 'Request processing took too long',
      timeoutDuration: '30s',
      suggestion: 'Try again with a simpler request'
    }));
  })

  // GoneException (410)
  .get('/decorator/gone', ({ httpException }) => {
    return httpException(new GoneException({
      error: 'RESOURCE_GONE',
      message: 'This resource has been permanently removed',
      removedAt: '2024-01-15T00:00:00Z',
      reason: 'Data retention policy'
    }));
  })

  // LengthRequiredException (411)
  .post('/decorator/length-required', ({ headers, httpException }) => {
    if (!headers['content-length']) {
      return httpException(new LengthRequiredException({
        error: 'LENGTH_REQUIRED',
        message: 'Content-Length header is required for this endpoint',
        requiredHeaders: ['Content-Length']
      }));
    }
    return { message: 'Request accepted' };
  })

  // PreconditionFailedException (412)
  .get('/decorator/precondition-failed', ({ headers, httpException }) => {
    const ifMatch = headers['if-match'];
    if (ifMatch && ifMatch !== '"current-etag"') {
      return httpException(new PreconditionFailedException({
        error: 'PRECONDITION_FAILED',
        message: 'If-Match precondition failed',
        expectedEtag: '"current-etag"',
        receivedEtag: ifMatch
      }));
    }
    return { message: 'Precondition satisfied', etag: '"current-etag"' };
  })

  // UriTooLongException (414)
  .get('/decorator/uri-too-long', ({ request, httpException }) => {
    const url = request.url;
    if (url.length > 100) { // Simulate URI length limit
      return httpException(new UriTooLongException({
        error: 'URI_TOO_LONG',
        message: 'Request URI exceeds maximum length',
        maxLength: 100,
        actualLength: url.length,
        suggestion: 'Use POST with request body instead'
      }));
    }
    return { message: 'URI length acceptable' };
  })

  // RangeNotSatisfiableException (416)
  .get('/decorator/range-not-satisfiable', ({ headers, httpException }) => {
    const range = headers['range'];
    if (range) {
      return httpException(new RangeNotSatisfiableException({
        error: 'RANGE_NOT_SATISFIABLE',
        message: 'Requested range cannot be satisfied',
        requestedRange: range,
        availableRange: 'bytes=0-999',
        contentLength: 1000
      }));
    }
    return { message: 'Full content', size: 1000 };
  })

  // ExpectationFailedException (417)
  .post('/decorator/expectation-failed', ({ headers, httpException }) => {
    const expect = headers['expect'];
    if (expect && expect !== '100-continue') {
      return httpException(new ExpectationFailedException({
        error: 'EXPECTATION_FAILED',
        message: 'Server cannot meet the expectation in the Expect header',
        receivedExpectation: expect,
        supportedExpectations: ['100-continue']
      }));
    }
    return { message: 'Expectation met' };
  })

  // MisdirectedRequestException (421)
  .get('/decorator/misdirected', ({ headers, httpException }) => {
    const host = headers['host'];
    if (host && host !== 'localhost:3001' && host !== '127.0.0.1:3001') {
      return httpException(new MisdirectedRequestException({
        error: 'MISDIRECTED_REQUEST',
        message: 'Request was directed to wrong server',
        receivedHost: host,
        expectedHosts: ['localhost:3001', '127.0.0.1:3001']
      }));
    }
    return { message: 'Request properly directed' };
  })

  // LockedException (423)
  .post('/decorator/locked', ({ httpException }) => {
    return httpException(new LockedException({
      error: 'RESOURCE_LOCKED',
      message: 'Resource is currently locked by another process',
      lockedBy: 'admin-user',
      lockedAt: new Date(Date.now() - 300000).toISOString(), // 5 min ago
      estimatedUnlockTime: new Date(Date.now() + 600000).toISOString() // 10 min from now
    }));
  })

  // FailedDependencyException (424)
  .post('/decorator/failed-dependency', ({ body, httpException }) => {
    const data = body as any;
    
    // Simulate dependency check
    if (data?.action === 'deploy' && (!data?.prerequisites || !data.prerequisites.includes('build-complete'))) {
      return httpException(new FailedDependencyException({
        error: 'DEPLOYMENT_DEPENDENCY_FAILED',
        message: 'Cannot deploy because build process has not completed successfully',
        failedDependency: 'build-complete',
        requiredPrerequisites: ['build-complete', 'tests-passed', 'security-scan-passed'],
        providedPrerequisites: data?.prerequisites || [],
        suggestion: 'Complete the build process before attempting deployment'
      }));
    }

    return { message: 'Dependencies satisfied, action completed' };
  })

  // TooEarlyException (425)
  .get('/decorator/too-early', ({ httpException }) => {
    return httpException(new TooEarlyException({
      error: 'TOO_EARLY',
      message: 'Request sent too early in the connection lifecycle',
      reason: 'TLS handshake not yet complete',
      retryAfter: '5s'
    }));
  })

  // UpgradeRequiredException (426)
  .get('/decorator/upgrade-required', ({ headers, httpException }) => {
    const userAgent = headers['user-agent'] || '';
    
    // Simulate old client detection
    if (userAgent.includes('OldClient/1.0') || userAgent.includes('DeprecatedApp')) {
      return httpException(new UpgradeRequiredException({
        error: 'CLIENT_UPGRADE_REQUIRED',
        message: 'Your client version is no longer supported',
        currentVersion: 'v1.0',
        minimumVersion: 'v2.0',
        latestVersion: 'v3.1',
        downloadUrl: 'https://example.com/download/latest',
        supportEndsAt: '2024-03-01T00:00:00Z'
      }));
    }

    return { message: 'Client version acceptable' };
  })

  // PreconditionRequiredException (428)
  .get('/decorator/precondition-required', ({ headers, httpException }) => {
    if (!headers['if-match'] && !headers['if-none-match']) {
      return httpException(new PreconditionRequiredException({
        error: 'PRECONDITION_REQUIRED',
        message: 'Request must include a precondition header',
        requiredHeaders: ['If-Match', 'If-None-Match'],
        reason: 'To prevent lost update problems'
      }));
    }
    return { message: 'Precondition header present' };
  })

  // RequestHeaderFieldsTooLargeException (431)
  .get('/decorator/header-too-large', ({ headers, httpException }) => {
    const userAgent = headers['user-agent'] || '';
    if (userAgent.length > 200) { // Simulate header size limit
      return httpException(new RequestHeaderFieldsTooLargeException({
        error: 'HEADER_TOO_LARGE',
        message: 'Request header fields are too large',
        maxHeaderSize: 200,
        actualHeaderSize: userAgent.length,
        problematicHeader: 'User-Agent'
      }));
    }
    return { message: 'Headers within acceptable size' };
  })

  // UnavailableForLegalReasonsException (451)
  .get('/decorator/legal-restriction', ({ headers, httpException }) => {
    const userCountry = headers['cf-ipcountry'] || headers['x-country'] || 'US';
    
    // Simulate GDPR compliance check
    if (userCountry === 'EU' && !headers['gdpr-consent']) {
      return httpException(new UnavailableForLegalReasonsException({
        error: 'GDPR_CONSENT_REQUIRED',
        message: 'This service requires GDPR compliance consent for EU users',
        regulation: 'GDPR (General Data Protection Regulation)',
        country: userCountry,
        consentUrl: 'https://example.com/privacy/consent',
        privacyPolicyUrl: 'https://example.com/privacy'
      }));
    }

    return { message: 'Content is legally available', country: userCountry };
  })

  // NotImplementedException (501)
  .get('/decorator/not-implemented', ({ httpException }) => {
    return httpException(new NotImplementedException({
      error: 'NOT_IMPLEMENTED',
      message: 'This feature is not yet implemented',
      feature: 'Advanced search functionality',
      plannedImplementation: '2024-Q2',
      alternatives: ['/basic-search', '/simple-filter']
    }));
  })

  // BadGatewayException (502)
  .get('/decorator/bad-gateway', ({ httpException }) => {
    return httpException(new BadGatewayException({
      error: 'BAD_GATEWAY',
      message: 'Received invalid response from upstream server',
      upstreamServer: 'api.upstream.com',
      upstreamStatus: 'invalid_json_response',
      retryable: true
    }));
  })

  // GatewayTimeoutException (504)
  .get('/decorator/gateway-timeout', ({ httpException }) => {
    return httpException(new GatewayTimeoutException({
      error: 'GATEWAY_TIMEOUT',
      message: 'Upstream server did not respond in time',
      upstreamServer: 'slow-service.com',
      timeoutDuration: '30s',
      suggestion: 'Try again later when upstream service is responsive'
    }));
  })

  // HttpVersionNotSupportedException (505)
  .get('/decorator/http-version-not-supported', ({ httpException }) => {
    return httpException(new HttpVersionNotSupportedException({
      error: 'HTTP_VERSION_NOT_SUPPORTED',
      message: 'HTTP version not supported',
      requestedVersion: 'HTTP/0.9',
      supportedVersions: ['HTTP/1.1', 'HTTP/2.0'],
      upgradeRequired: true
    }));
  })

  // VariantAlsoNegotiatesException (506)
  .get('/decorator/variant-negotiates', ({ httpException }) => {
    return httpException(new VariantAlsoNegotiatesException({
      error: 'VARIANT_ALSO_NEGOTIATES',
      message: 'Transparent content negotiation results in circular reference',
      negotiationLoop: ['variant-a', 'variant-b', 'variant-a'],
      solution: 'Choose a specific variant manually'
    }));
  })

  // InsufficientStorageException (507)
  .post('/decorator/insufficient-storage', ({ httpException }) => {
    return httpException(new InsufficientStorageException({
      error: 'INSUFFICIENT_STORAGE',
      message: 'Server has insufficient storage to complete the request',
      availableStorage: '10MB',
      requiredStorage: '50MB',
      suggestion: 'Try uploading smaller files or contact administrator'
    }));
  })

  // LoopDetectedException (508)
  .get('/decorator/loop-detected', ({ httpException }) => {
    return httpException(new LoopDetectedException({
      error: 'LOOP_DETECTED',
      message: 'Infinite loop detected in request processing',
      loopPath: ['/a', '/b', '/c', '/a'],
      maxDepth: 10,
      currentDepth: 15
    }));
  })

  // NotExtendedException (510)
  .get('/decorator/not-extended', ({ httpException }) => {
    return httpException(new NotExtendedException({
      error: 'NOT_EXTENDED',
      message: 'Further extensions to the request are required',
      requiredExtensions: ['Authentication-Extension', 'Compression-Extension'],
      documentation: 'https://example.com/api/extensions'
    }));
  })

  // NetworkAuthenticationRequiredException (511)
  .get('/decorator/network-auth-required', ({ httpException }) => {
    return httpException(new NetworkAuthenticationRequiredException({
      error: 'NETWORK_AUTH_REQUIRED',
      message: 'Network authentication required to access this resource',
      authenticationUrl: 'https://captive.portal.com/login',
      networkProvider: 'Corporate WiFi',
      instructions: 'Please authenticate with the network first'
    }));
  })

  .listen(3001);

console.log(`🚀 Decorator Examples Server is running at http://localhost:3001`);

console.log('\n📚 Available endpoints for Decorator Examples:');
console.log('GET / - Welcome message');
console.log('\n🎯 Basic HTTP Status Examples with Decorator:');
console.log('GET /decorator/400 - Bad Request');
console.log('GET /decorator/401 - Unauthorized');
console.log('GET /decorator/403 - Forbidden');
console.log('GET /decorator/404 - Not Found');
console.log('GET /decorator/500 - Internal Server Error');
console.log('\n🔧 Core Examples with Decorator:');
console.log('GET /decorator/custom-object - Custom error with object data');
console.log('GET /decorator/custom-error - Custom error with Error object');
console.log('GET /decorator/users/:id - User management');
console.log('POST /decorator/validate - Basic validation');
console.log('GET /decorator/api/data - Rate limiting (429)');
console.log('POST /decorator/upload - File upload (413, 415)');
console.log('GET /decorator/database/status - Database connection (503)');
console.log('POST /decorator/payment - Payment processing (402)');
console.log('POST /decorator/resources - Resource conflict (409)');
console.log('GET /decorator/coffee - Teapot (418)');
console.log('GET /decorator/async-operation - Async operations');
console.log('\n🏗️ Complex Examples:');
console.log('POST /decorator/form/register - Comprehensive form validation');
console.log('POST /decorator/process/multi-step - Multi-step process');
console.log('GET /decorator/system/status - System maintenance (503)');
console.log('\n⚙️ Complete HTTP Exception Coverage:');
console.log('POST /decorator/method-not-allowed - Method Not Allowed (405)');
console.log('GET /decorator/not-acceptable - Not Acceptable (406)');
console.log('GET /decorator/timeout - Request Timeout (408)');
console.log('GET /decorator/gone - Gone (410)');
console.log('POST /decorator/length-required - Length Required (411)');
console.log('GET /decorator/precondition-failed - Precondition Failed (412)');
console.log('GET /decorator/uri-too-long - URI Too Long (414)');
console.log('GET /decorator/range-not-satisfiable - Range Not Satisfiable (416)');
console.log('POST /decorator/expectation-failed - Expectation Failed (417)');
console.log('GET /decorator/misdirected - Misdirected Request (421)');
console.log('POST /decorator/locked - Locked (423)');
console.log('POST /decorator/failed-dependency - Failed Dependency (424)');
console.log('GET /decorator/too-early - Too Early (425)');
console.log('GET /decorator/upgrade-required - Upgrade Required (426)');
console.log('GET /decorator/precondition-required - Precondition Required (428)');
console.log('GET /decorator/header-too-large - Header Too Large (431)');
console.log('GET /decorator/legal-restriction - Legal Restriction (451)');
console.log('GET /decorator/not-implemented - Not Implemented (501)');
console.log('GET /decorator/bad-gateway - Bad Gateway (502)');
console.log('GET /decorator/gateway-timeout - Gateway Timeout (504)');
console.log('GET /decorator/http-version-not-supported - HTTP Version Not Supported (505)');
console.log('GET /decorator/variant-negotiates - Variant Also Negotiates (506)');
console.log('POST /decorator/insufficient-storage - Insufficient Storage (507)');
console.log('GET /decorator/loop-detected - Loop Detected (508)');
console.log('GET /decorator/not-extended - Not Extended (510)');
console.log('GET /decorator/network-auth-required - Network Auth Required (511)');
console.log('\n🔗 Elysia Error Handling:');
console.log('POST /decorator/elysia-errors/parse-error - PARSE error handling');
console.log('GET /decorator/elysia-errors/not-found-simulation - NOT_FOUND simulation');
console.log('GET /decorator/elysia-errors/unknown-simulation - UNKNOWN error simulation');

console.log('\n💡 Quick Test Examples:');
console.log('# Basic errors:');
console.log('curl http://localhost:3001/decorator/404');
console.log('curl http://localhost:3001/decorator/coffee');
console.log('\n# HTTP method examples:');
console.log('curl -X POST http://localhost:3001/decorator/method-not-allowed  # 405');
console.log('curl -H "Accept: text/html" http://localhost:3001/decorator/not-acceptable  # 406');
console.log('\n# Header-based examples:');
console.log('curl -H "If-Match: wrong-etag" http://localhost:3001/decorator/precondition-failed  # 412');
console.log('curl -H "Range: bytes=2000-3000" http://localhost:3001/decorator/range-not-satisfiable  # 416');
console.log('curl -H "Expect: invalid" -X POST http://localhost:3001/decorator/expectation-failed  # 417');
console.log('\n# Complex validation:');
console.log('curl -X POST http://localhost:3001/decorator/form/register -H "Content-Type: application/json" -d \'{"email":"admin@example.com"}\' # Conflict');
console.log('curl -X POST http://localhost:3001/decorator/form/register -H "Content-Type: application/json" -d \'{"email":"test@example.com","password":"StrongPass123","age":25,"acceptTerms":true}\' # Success');
console.log('\n# Parse error (malformed JSON):');
console.log('curl -X POST http://localhost:3001/decorator/elysia-errors/parse-error -H "Content-Type: application/json" -d \'{invalid}\' # PARSE error');

console.log('\n🔄 Compare with throw examples at: http://localhost:3000');
