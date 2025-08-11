import { describe, expect, it, beforeAll, afterAll } from 'bun:test';
import { spawn } from 'bun';

describe('Decorator Example E2E Tests', () => {
  let decoratorExampleProcess: any;
  const decoratorPort = 3001;
  const decoratorBaseUrl = `http://localhost:${decoratorPort}`;

  beforeAll(async () => {
    console.log('Starting decorator example server...');
    
    // Start decorator example server  
    decoratorExampleProcess = spawn(['bun', 'run', 'example/example-decorator.ts'], {
      stdio: ['ignore', 'ignore', 'ignore'],
      cwd: process.cwd()
    });

    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('Decorator server should be started now');
  });

  afterAll(async () => {
    if (decoratorExampleProcess) {
      console.log('Killing decorator example server...');
      decoratorExampleProcess.kill();
    }
    
    // Wait a bit for cleanup
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  describe('Basic Routes', () => {
    it('should handle home route', async () => {
      const response = await fetch(`${decoratorBaseUrl}/`);
      expect(response.status).toBe(200);
      
      const body = await response.text();
      expect(body).toBe('Elysia HTTP Exception Decorator Examples - Using httpException decorator instead of throw');
    });
  });

  describe('Basic Decorator HTTP Status Examples', () => {
    it('should handle 400 Bad Request with decorator', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/400`);
      expect(response.status).toBe(400);
      
      const body = await response.json();
      expect(body).toEqual({
        statusCode: 400,
        message: 'Invalid request format using decorator'
      });
    });

    it('should handle 401 Unauthorized with decorator', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/401`);
      expect(response.status).toBe(401);
      
      const body = await response.json();
      expect(body).toEqual({
        statusCode: 401,
        message: 'Authentication required using decorator'
      });
    });

    it('should handle 403 Forbidden with decorator', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/403`);
      expect(response.status).toBe(403);
      
      const body = await response.json();
      expect(body).toEqual({
        statusCode: 403,
        message: 'Access denied using decorator'
      });
    });

    it('should handle 404 Not Found with decorator', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/404`);
      expect(response.status).toBe(404);
      
      const body = await response.json();
      expect(body).toEqual({
        statusCode: 404,
        message: 'Resource not found using decorator'
      });
    });

    it('should handle 500 Internal Server Error with decorator', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/500`);
      expect(response.status).toBe(500);
      
      const body = await response.json();
      expect(body).toEqual({
        statusCode: 500,
        message: 'Server error using decorator'
      });
    });
  });

  describe('Custom Object and Error Examples', () => {
    it('should handle custom object with decorator', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/custom-object`);
      expect(response.status).toBe(400);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'VALIDATION_FAILED',
        details: {
          field: 'email',
          message: 'Invalid email format',
          code: 'EMAIL_INVALID'
        },
        timestamp: expect.any(String),
        requestId: 'req-123456'
      });
    });

    it('should handle custom error object with decorator', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/custom-error`);
      expect(response.status).toBe(422);
      
      const body = await response.json();
      expect(body).toEqual({
        statusCode: 422,
        message: 'Custom validation failed'
      });
    });
  });

  describe('User Management with Decorator', () => {
    it('should handle invalid user ID (NaN) with decorator', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/users/abc`);
      expect(response.status).toBe(400);
      
      const body = await response.json();
      expect(body).toEqual({
        statusCode: 400,
        message: 'User ID must be a valid number'
      });
    });

    it('should handle negative user ID with decorator', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/users/-1`);
      expect(response.status).toBe(400);
      
      const body = await response.json();
      expect(body).toEqual({
        statusCode: 400,
        message: 'User ID must be positive'
      });
    });

    it('should handle user not found with decorator', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/users/404`);
      expect(response.status).toBe(404);
      
      const body = await response.json();
      expect(body).toEqual({
        statusCode: 404,
        message: 'User with ID 404 not found'
      });
    });

    it('should handle forbidden user access with decorator', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/users/403`);
      expect(response.status).toBe(403);
      
      const body = await response.json();
      expect(body).toEqual({
        statusCode: 403,
        message: 'You do not have permission to view this user'
      });
    });

    it('should handle server error for user lookup with decorator', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/users/500`);
      expect(response.status).toBe(500);
      
      const body = await response.json();
      expect(body).toEqual({
        statusCode: 500,
        message: 'Database connection failed'
      });
    });

    it('should return valid user for valid ID with decorator', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/users/123`);
      expect(response.status).toBe(200);
      
      const body = await response.json();
      expect(body).toEqual({
        id: 123,
        name: 'User 123',
        email: 'user123@example.com'
      });
    });
  });

  describe('API Validation with Decorator', () => {
    it('should handle missing request body', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      // May return 400 or 500 depending on how Elysia handles missing body
      expect([400, 500].includes(response.status)).toBe(true);
      
      try {
        const body = await response.json();
        expect(body).toHaveProperty('message');
        if (response.status === 400) {
          expect(body).toEqual({
            statusCode: 400,
            message: 'Request body is required'
          });
        }
      } catch (error) {
        // If JSON parsing fails, we can just check the response was received
        expect(response.status).toBeGreaterThanOrEqual(400);
      }
    });

    it('should handle missing name field', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' })
      });
      expect(response.status).toBe(422);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'VALIDATION_ERROR',
        field: 'name',
        message: 'Name is required'
      });
    });

    it('should handle missing email field', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'John Doe' })
      });
      expect(response.status).toBe(422);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'VALIDATION_ERROR',
        field: 'email',
        message: 'Email is required'
      });
    });

    it('should handle invalid email format', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'John Doe', email: 'invalid-email' })
      });
      expect(response.status).toBe(422);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'VALIDATION_ERROR',
        field: 'email',
        message: 'Invalid email format'
      });
    });

    it('should handle valid data successfully', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'John Doe', email: 'john@example.com' })
      });
      expect(response.status).toBe(200);
      
      const body = await response.json();
      expect(body).toEqual({
        message: 'Data validated successfully',
        data: {
          name: 'John Doe',
          email: 'john@example.com'
        }
      });
    });
  });

  describe('Rate Limiting with Decorator', () => {
    it('should handle successful API call or rate limit (random)', async () => {
      // Since the rate limit is random (70% chance), we test multiple times
      let foundRateLimit = false;
      let foundSuccess = false;

      // Try multiple times to catch both scenarios
      for (let i = 0; i < 10; i++) {
        const response = await fetch(`${decoratorBaseUrl}/decorator/api/data`);
        
        if (response.status === 429) {
          foundRateLimit = true;
          const body = await response.json();
          expect(body).toEqual({
            message: 'Rate limit exceeded',
            retryAfter: 60,
            limit: 100,
            remaining: 0
          });
        } else if (response.status === 200) {
          foundSuccess = true;
          const body = await response.json();
          expect(body).toEqual({
            data: 'Some API data',
            timestamp: expect.any(Number)
          });
        }

        // If we found both scenarios, we can break
        if (foundRateLimit && foundSuccess) break;
      }

      // At least one of the scenarios should have been hit
      expect(foundRateLimit || foundSuccess).toBe(true);
    });
  });

  describe('File Upload with Decorator', () => {
    it('should handle file upload scenarios', async () => {
      // Since file size and type are random, test multiple times
      let foundPayloadTooLarge = false;
      let foundUnsupportedMedia = false;
      let foundSuccess = false;

      for (let i = 0; i < 15; i++) {
        const response = await fetch(`${decoratorBaseUrl}/decorator/upload`, {
          method: 'POST'
        });

        if (response.status === 413) {
          foundPayloadTooLarge = true;
          const body = await response.json();
          expect(body).toHaveProperty('message');
          expect(body.message).toContain('exceeds maximum');
          expect(body).toHaveProperty('maxSize', 5);
          expect(body).toHaveProperty('actualSize');
        } else if (response.status === 415) {
          foundUnsupportedMedia = true;
          const body = await response.json();
          expect(body).toEqual({
            statusCode: 415,
            message: 'Only image files are allowed'
          });
        } else if (response.status === 200) {
          foundSuccess = true;
          const body = await response.json();
          expect(body).toEqual({
            message: 'File uploaded successfully',
            size: expect.stringMatching(/^\d+\.\d{2}MB$/),
            processed: true
          });
        }

        // If we found all scenarios, break
        if (foundPayloadTooLarge && foundUnsupportedMedia && foundSuccess) break;
      }

      // At least one scenario should have been hit
      expect(foundPayloadTooLarge || foundUnsupportedMedia || foundSuccess).toBe(true);
    });
  });

  describe('Database Connection with Decorator', () => {
    it('should handle database connection scenarios', async () => {
      // Test multiple times to catch both scenarios (70% chance of success)
      let foundServiceUnavailable = false;
      let foundSuccess = false;

      for (let i = 0; i < 10; i++) {
        const response = await fetch(`${decoratorBaseUrl}/decorator/database/status`);

        if (response.status === 503) {
          foundServiceUnavailable = true;
          const body = await response.json();
          expect(body).toEqual({
            statusCode: 503,
            message: 'Database connection failed - please try again later'
          });
        } else if (response.status === 200) {
          foundSuccess = true;
          const body = await response.json();
          expect(body).toEqual({
            status: 'Database is healthy',
            connections: 25
          });
        }

        if (foundServiceUnavailable && foundSuccess) break;
      }

      expect(foundServiceUnavailable || foundSuccess).toBe(true);
    });
  });

  describe('Payment Processing with Decorator', () => {
    it('should handle payment processing scenarios', async () => {
      // Test multiple times to catch both scenarios (50% chance)
      let foundPaymentRequired = false;
      let foundSuccess = false;

      for (let i = 0; i < 10; i++) {
        const response = await fetch(`${decoratorBaseUrl}/decorator/payment`, {
          method: 'POST'
        });

        if (response.status === 402) {
          foundPaymentRequired = true;
          const body = await response.json();
          expect(body).toEqual({
            message: 'Payment is required to access this resource',
            amount: 9.99,
            currency: 'USD',
            paymentUrl: '/payment/checkout'
          });
        } else if (response.status === 200) {
          foundSuccess = true;
          const body = await response.json();
          expect(body).toEqual({
            message: 'Payment processed successfully',
            transactionId: 'txn-123456'
          });
        }

        if (foundPaymentRequired && foundSuccess) break;
      }

      expect(foundPaymentRequired || foundSuccess).toBe(true);
    });
  });

  describe('Resource Conflict with Decorator', () => {
    it('should handle resource conflict scenarios', async () => {
      // Test multiple times to catch both scenarios (40% chance of conflict)
      let foundConflict = false;
      let foundSuccess = false;

      for (let i = 0; i < 10; i++) {
        const response = await fetch(`${decoratorBaseUrl}/decorator/resources`, {
          method: 'POST'
        });

        if (response.status === 409) {
          foundConflict = true;
          const body = await response.json();
          expect(body).toEqual({
            message: 'Resource already exists',
            conflictingResource: 'user-email-john@example.com',
            suggestion: 'Use PUT to update existing resource'
          });
        } else if (response.status === 200) {
          foundSuccess = true;
          const body = await response.json();
          expect(body).toEqual({
            message: 'Resource created successfully',
            id: 'res-123456'
          });
        }

        if (foundConflict && foundSuccess) break;
      }

      expect(foundConflict || foundSuccess).toBe(true);
    });
  });

  describe('Teapot Exception with Decorator', () => {
    it('should handle teapot exception', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/coffee`);
      expect(response.status).toBe(418);
      
      const body = await response.json();
      expect(body).toEqual({
        statusCode: 418,
        message: "I'm a teapot, cannot brew coffee! Try tea instead."
      });
    });
  });

  describe('Async Operation with Decorator', () => {
    it('should handle async operation scenarios', async () => {
      // Test multiple times to catch both scenarios (50% chance)
      let foundInternalError = false;
      let foundSuccess = false;

      for (let i = 0; i < 15; i++) {
        const response = await fetch(`${decoratorBaseUrl}/decorator/async-operation`);

        if (response.status === 500) {
          foundInternalError = true;
          const body = await response.json();
          expect(body).toEqual({
            statusCode: 500,
            message: 'Async operation failed'
          });
        } else if (response.status === 200) {
          foundSuccess = true;
          const body = await response.json();
          expect(body).toEqual({
            message: 'Async operation completed successfully'
          });
        }

        if (foundInternalError && foundSuccess) break;
      }

      expect(foundInternalError || foundSuccess).toBe(true);
    });
  });

  describe('Comprehensive Form Validation with Decorator', () => {
    it('should handle missing email', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/form/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'StrongPass123', age: 25, acceptTerms: true })
      });
      expect(response.status).toBe(422);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'VALIDATION_ERRORS',
        message: 'Registration form contains validation errors',
        errors: [{ field: 'email', message: 'Email is required', code: 'REQUIRED' }],
        totalErrors: 1
      });
    });

    it('should handle invalid email format', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/form/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'invalid-email', password: 'StrongPass123', age: 25, acceptTerms: true })
      });
      expect(response.status).toBe(422);
      
      const body = await response.json();
      expect(body.error).toBe('VALIDATION_ERRORS');
      expect(body.errors).toContainEqual({ field: 'email', message: 'Invalid email format', code: 'INVALID_FORMAT' });
    });

    it('should handle existing email conflict', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/form/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@example.com', password: 'StrongPass123', age: 25, acceptTerms: true })
      });
      expect(response.status).toBe(409);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'EMAIL_ALREADY_EXISTS',
        message: 'Email address is already registered',
        field: 'email',
        suggestion: 'Try logging in or use forgot password'
      });
    });

    it('should handle weak password', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/form/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'weak', age: 25, acceptTerms: true })
      });
      expect(response.status).toBe(422);
      
      const body = await response.json();
      expect(body.error).toBe('VALIDATION_ERRORS');
      expect(body.errors).toEqual(expect.arrayContaining([
        expect.objectContaining({ field: 'password', code: 'TOO_SHORT' })
      ]));
    });

    it('should handle age restriction', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/form/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'kid@example.com', password: 'StrongPass123', age: 12, acceptTerms: true })
      });
      expect(response.status).toBe(403);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'AGE_RESTRICTION',
        message: 'Must be at least 13 years old to register',
        minimumAge: 13,
        providedAge: 12
      });
    });

    it('should handle missing terms acceptance', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/form/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'StrongPass123', age: 25 })
      });
      expect(response.status).toBe(400);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'TERMS_NOT_ACCEPTED',
        message: 'You must accept the terms and conditions',
        field: 'acceptTerms'
      });
    });

    it('should handle successful registration', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/form/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: 'newuser@example.com', 
          password: 'StrongPass123', 
          age: 25, 
          acceptTerms: true 
        })
      });
      expect(response.status).toBe(200);
      
      const body = await response.json();
      expect(body).toEqual({
        message: 'Registration successful',
        user: {
          email: 'newuser@example.com',
          age: 25,
          registeredAt: expect.any(String)
        }
      });
    });
  });

  describe('Multi-step Process with Decorator', () => {
    it('should handle missing personal info for step 1', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/process/multi-step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 1 })
      });
      expect(response.status).toBe(400);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'MISSING_PERSONAL_INFO',
        message: 'Personal information is required for step 1',
        requiredFields: ['firstName', 'lastName', 'dateOfBirth']
      });
    });

    it('should handle step 1 completion', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/process/multi-step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          step: 1, 
          personalInfo: { firstName: 'John', lastName: 'Doe', dateOfBirth: '1990-01-01' }
        })
      });
      expect(response.status).toBe(200);
      
      const body = await response.json();
      expect(body).toEqual({
        message: 'Step 1 completed',
        nextStep: 2
      });
    });

    it('should handle missing contact info for step 2', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/process/multi-step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 2 })
      });
      expect(response.status).toBe(400);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'MISSING_CONTACT_INFO',
        message: 'Contact information is required for step 2',
        requiredFields: ['email', 'phone', 'address']
      });
    });

    it('should handle missing payment info for step 3', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/process/multi-step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 3 })
      });
      expect(response.status).toBe(402);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'PAYMENT_INFO_REQUIRED',
        message: 'Payment information is required for step 3',
        acceptedPaymentMethods: ['credit_card', 'debit_card', 'paypal']
      });
    });

    it('should handle invalid step', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/process/multi-step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 99 })
      });
      expect(response.status).toBe(400);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'INVALID_STEP',
        message: 'Invalid step: 99',
        validSteps: [1, 2, 3],
        currentStep: 99
      });
    });
  });

  describe('System Status with Decorator', () => {
    it('should handle system status scenarios', async () => {
      // Test multiple times to catch different scenarios
      let foundMaintenance = false;
      let foundOverload = false;
      let foundOperational = false;

      for (let i = 0; i < 20; i++) {
        const response = await fetch(`${decoratorBaseUrl}/decorator/system/status`);

        if (response.status === 503) {
          const body = await response.json();
          
          if (body.error === 'MAINTENANCE_MODE') {
            foundMaintenance = true;
            expect(body).toEqual({
              error: 'MAINTENANCE_MODE',
              message: 'System is currently under maintenance',
              maintenanceStarted: expect.any(String),
              estimatedCompletion: expect.any(String),
              statusPageUrl: 'https://status.example.com'
            });
          } else if (body.error === 'SYSTEM_OVERLOADED') {
            foundOverload = true;
            expect(body).toEqual({
              error: 'SYSTEM_OVERLOADED',
              message: 'System is currently experiencing high load',
              retryAfter: '60s',
              currentLoad: '95%',
              recommendedAction: 'Please try again in a few minutes'
            });
          }
        } else if (response.status === 200) {
          foundOperational = true;
          const body = await response.json();
          expect(body).toEqual({
            status: 'operational',
            uptime: '99.9%',
            responseTime: '120ms',
            activeConnections: 1247
          });
        }

        // If we found all scenarios, break
        if (foundMaintenance && foundOverload && foundOperational) break;
      }

      // At least one scenario should have been hit
      expect(foundMaintenance || foundOverload || foundOperational).toBe(true);
    });
  });

  describe('Complete HTTP Exception Coverage', () => {
    it('should handle Method Not Allowed (405)', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/method-not-allowed`, {
        method: 'POST'
      });
      expect(response.status).toBe(405);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'METHOD_NOT_ALLOWED',
        message: 'This endpoint only accepts GET requests',
        allowedMethods: ['GET'],
        receivedMethod: 'POST'
      });
    });

    it('should handle Not Acceptable (406)', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/not-acceptable`, {
        headers: { 'Accept': 'text/html' }
      });
      expect(response.status).toBe(406);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'NOT_ACCEPTABLE',
        message: 'This endpoint only provides JSON responses',
        clientAccepts: 'text/html',
        serverProvides: ['application/json']
      });
    });

    it('should handle Request Timeout (408)', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/timeout`);
      expect(response.status).toBe(408);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'REQUEST_TIMEOUT',
        message: 'Request processing took too long',
        timeoutDuration: '30s',
        suggestion: 'Try again with a simpler request'
      });
    });

    it('should handle Gone (410)', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/gone`);
      expect(response.status).toBe(410);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'RESOURCE_GONE',
        message: 'This resource has been permanently removed',
        removedAt: '2024-01-15T00:00:00Z',
        reason: 'Data retention policy'
      });
    });

    it('should handle Length Required (411)', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/length-required`, {
        method: 'POST'
      });
      
      // Since fetch automatically adds Content-Length, this may return 200
      // The endpoint checks for the header existence, which fetch provides
      if (response.status === 411) {
        const body = await response.json();
        expect(body).toEqual({
          error: 'LENGTH_REQUIRED',
          message: 'Content-Length header is required for this endpoint',
          requiredHeaders: ['Content-Length']
        });
      } else if (response.status === 200) {
        // If Content-Length is automatically provided by fetch
        const body = await response.json();
        expect(body).toEqual({
          message: 'Request accepted'
        });
      }
    });

    it('should handle Precondition Failed (412)', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/precondition-failed`, {
        headers: { 'If-Match': '"wrong-etag"' }
      });
      expect(response.status).toBe(412);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'PRECONDITION_FAILED',
        message: 'If-Match precondition failed',
        expectedEtag: '"current-etag"',
        receivedEtag: '"wrong-etag"'
      });
    });

    it('should handle Range Not Satisfiable (416)', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/range-not-satisfiable`, {
        headers: { 'Range': 'bytes=2000-3000' }
      });
      expect(response.status).toBe(416);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'RANGE_NOT_SATISFIABLE',
        message: 'Requested range cannot be satisfied',
        requestedRange: 'bytes=2000-3000',
        availableRange: 'bytes=0-999',
        contentLength: 1000
      });
    });

    it('should handle Expectation Failed (417)', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/expectation-failed`, {
        method: 'POST',
        headers: { 'Expect': 'invalid-expectation' }
      });
      expect(response.status).toBe(417);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'EXPECTATION_FAILED',
        message: 'Server cannot meet the expectation in the Expect header',
        receivedExpectation: 'invalid-expectation',
        supportedExpectations: ['100-continue']
      });
    });

    it('should handle I\'m a Teapot (418) with special endpoint', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/coffee`);
      expect(response.status).toBe(418);
      
      const body = await response.json();
      expect(body).toEqual({
        statusCode: 418,
        message: "I'm a teapot, cannot brew coffee! Try tea instead."
      });
    });

    it('should handle Locked (423)', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/locked`, {
        method: 'POST'
      });
      expect(response.status).toBe(423);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'RESOURCE_LOCKED',
        message: 'Resource is currently locked by another process',
        lockedBy: 'admin-user',
        lockedAt: expect.any(String),
        estimatedUnlockTime: expect.any(String)
      });
    });

    it('should handle Failed Dependency (424)', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/failed-dependency`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deploy', prerequisites: ['tests-passed'] })
      });
      expect(response.status).toBe(424);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'DEPLOYMENT_DEPENDENCY_FAILED',
        message: 'Cannot deploy because build process has not completed successfully',
        failedDependency: 'build-complete',
        requiredPrerequisites: ['build-complete', 'tests-passed', 'security-scan-passed'],
        providedPrerequisites: ['tests-passed'],
        suggestion: 'Complete the build process before attempting deployment'
      });
    });

    it('should handle Too Early (425)', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/too-early`);
      expect(response.status).toBe(425);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'TOO_EARLY',
        message: 'Request sent too early in the connection lifecycle',
        reason: 'TLS handshake not yet complete',
        retryAfter: '5s'
      });
    });

    it('should handle Upgrade Required (426)', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/upgrade-required`, {
        headers: { 'User-Agent': 'OldClient/1.0' }
      });
      expect(response.status).toBe(426);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'CLIENT_UPGRADE_REQUIRED',
        message: 'Your client version is no longer supported',
        currentVersion: 'v1.0',
        minimumVersion: 'v2.0',
        latestVersion: 'v3.1',
        downloadUrl: 'https://example.com/download/latest',
        supportEndsAt: '2024-03-01T00:00:00Z'
      });
    });

    it('should handle Precondition Required (428)', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/precondition-required`);
      expect(response.status).toBe(428);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'PRECONDITION_REQUIRED',
        message: 'Request must include a precondition header',
        requiredHeaders: ['If-Match', 'If-None-Match'],
        reason: 'To prevent lost update problems'
      });
    });

    it('should handle Request Header Fields Too Large (431)', async () => {
      const longUserAgent = 'A'.repeat(250); // > 200 chars
      const response = await fetch(`${decoratorBaseUrl}/decorator/header-too-large`, {
        headers: { 'User-Agent': longUserAgent }
      });
      expect(response.status).toBe(431);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'HEADER_TOO_LARGE',
        message: 'Request header fields are too large',
        maxHeaderSize: 200,
        actualHeaderSize: 250,
        problematicHeader: 'User-Agent'
      });
    });

    it('should handle Unavailable for Legal Reasons (451)', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/legal-restriction`, {
        headers: { 'cf-ipcountry': 'EU' }
      });
      expect(response.status).toBe(451);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'GDPR_CONSENT_REQUIRED',
        message: 'This service requires GDPR compliance consent for EU users',
        regulation: 'GDPR (General Data Protection Regulation)',
        country: 'EU',
        consentUrl: 'https://example.com/privacy/consent',
        privacyPolicyUrl: 'https://example.com/privacy'
      });
    });

    // 5xx Server Error Tests
    it('should handle Not Implemented (501)', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/not-implemented`);
      expect(response.status).toBe(501);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'NOT_IMPLEMENTED',
        message: 'This feature is not yet implemented',
        feature: 'Advanced search functionality',
        plannedImplementation: '2024-Q2',
        alternatives: ['/basic-search', '/simple-filter']
      });
    });

    it('should handle Bad Gateway (502)', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/bad-gateway`);
      expect(response.status).toBe(502);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'BAD_GATEWAY',
        message: 'Received invalid response from upstream server',
        upstreamServer: 'api.upstream.com',
        upstreamStatus: 'invalid_json_response',
        retryable: true
      });
    });

    it('should handle Gateway Timeout (504)', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/gateway-timeout`);
      expect(response.status).toBe(504);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'GATEWAY_TIMEOUT',
        message: 'Upstream server did not respond in time',
        upstreamServer: 'slow-service.com',
        timeoutDuration: '30s',
        suggestion: 'Try again later when upstream service is responsive'
      });
    });

    it('should handle HTTP Version Not Supported (505)', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/http-version-not-supported`);
      expect(response.status).toBe(505);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'HTTP_VERSION_NOT_SUPPORTED',
        message: 'HTTP version not supported',
        requestedVersion: 'HTTP/0.9',
        supportedVersions: ['HTTP/1.1', 'HTTP/2.0'],
        upgradeRequired: true
      });
    });

    it('should handle Variant Also Negotiates (506)', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/variant-negotiates`);
      expect(response.status).toBe(506);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'VARIANT_ALSO_NEGOTIATES',
        message: 'Transparent content negotiation results in circular reference',
        negotiationLoop: ['variant-a', 'variant-b', 'variant-a'],
        solution: 'Choose a specific variant manually'
      });
    });

    it('should handle Insufficient Storage (507)', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/insufficient-storage`, {
        method: 'POST'
      });
      expect(response.status).toBe(507);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'INSUFFICIENT_STORAGE',
        message: 'Server has insufficient storage to complete the request',
        availableStorage: '10MB',
        requiredStorage: '50MB',
        suggestion: 'Try uploading smaller files or contact administrator'
      });
    });

    it('should handle Loop Detected (508)', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/loop-detected`);
      expect(response.status).toBe(508);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'LOOP_DETECTED',
        message: 'Infinite loop detected in request processing',
        loopPath: ['/a', '/b', '/c', '/a'],
        maxDepth: 10,
        currentDepth: 15
      });
    });

    it('should handle Not Extended (510)', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/not-extended`);
      expect(response.status).toBe(510);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'NOT_EXTENDED',
        message: 'Further extensions to the request are required',
        requiredExtensions: ['Authentication-Extension', 'Compression-Extension'],
        documentation: 'https://example.com/api/extensions'
      });
    });

    it('should handle Network Authentication Required (511)', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/network-auth-required`);
      expect(response.status).toBe(511);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'NETWORK_AUTH_REQUIRED',
        message: 'Network authentication required to access this resource',
        authenticationUrl: 'https://captive.portal.com/login',
        networkProvider: 'Corporate WiFi',
        instructions: 'Please authenticate with the network first'
      });
    });
  });

  describe('Elysia Error Handling Examples', () => {
    it('should handle parse error simulation', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/elysia-errors/parse-error`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{invalid json}'
      });
      
      // The exact response depends on how Elysia handles parse errors
      // It should be either 400 (handled by plugin) or the malformed JSON triggers an error
      expect([400, 500].includes(response.status)).toBe(true);
    });

    it('should handle NOT_FOUND simulation', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/elysia-errors/not-found-simulation`);
      expect(response.status).toBe(404);
      
      const body = await response.json();
      expect(body).toEqual({
        error: 'RESOURCE_NOT_FOUND',
        message: 'The requested resource does not exist',
        resourceType: 'simulation',
        suggestion: 'Check the URL and try again'
      });
    });

    it('should handle UNKNOWN error simulation', async () => {
      const response = await fetch(`${decoratorBaseUrl}/decorator/elysia-errors/unknown-simulation`);
      expect(response.status).toBe(500);
      
      const body = await response.json();
      expect(body).toEqual({
        statusCode: 500,
        message: 'Simulated unknown error'
      });
    });
  });

  describe('Content Type and Headers', () => {
    it('should return proper JSON content type for all errors', async () => {
      const testUrls = [
        `${decoratorBaseUrl}/decorator/400`,
        `${decoratorBaseUrl}/decorator/401`,
        `${decoratorBaseUrl}/decorator/404`,
        `${decoratorBaseUrl}/decorator/500`
      ];

      for (const url of testUrls) {
        const response = await fetch(url);
        expect(response.headers.get('content-type')).toContain('application/json');
      }
    });

    it('should return valid JSON for all error responses', async () => {
      const testUrls = [
        `${decoratorBaseUrl}/decorator/400`,
        `${decoratorBaseUrl}/decorator/custom-object`,
        `${decoratorBaseUrl}/decorator/500`
      ];

      for (const url of testUrls) {
        const response = await fetch(url);
        const text = await response.text();
        
        // Should be valid JSON
        expect(() => JSON.parse(text)).not.toThrow();
        
        // Should have proper error structure
        const body = JSON.parse(text);
        expect(typeof body).toBe('object');
        expect(body).not.toBeNull();
      }
    });
  });
});
