# 🚨 Elysia HTTP Exception

[![npm version](https://img.shields.io/npm/v/elysia-http-exception.svg?style=flat-square)](https://www.npmjs.com/package/elysia-http-exception)
[![npm downloads](https://img.shields.io/npm/dm/elysia-http-exception.svg?style=flat-square)](https://www.npmjs.com/package/elysia-http-exception)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=flat-square)](https://www.typescriptlang.org/)

A comprehensive Elysia plugin for handling HTTP 4xx and 5xx errors with structured exception classes and automatic error responses. This plugin provides a clean, type-safe way to handle HTTP exceptions in your Elysia applications.

## ✨ Features

- 🎯 **Complete HTTP Status Coverage** - Support for all standard 4xx and 5xx HTTP status codes
- 🔧 **Type-Safe** - Full TypeScript support with proper type definitions
- 🚀 **Easy Integration** - Simple plugin installation with zero configuration required
- 🎨 **Flexible Error Data** - Support for string messages, objects, and Error instances
- 🔄 **Two Usage Patterns** - Use either `throw` statements or the `httpException` decorator
- 🛡️ **Automatic Error Handling** - Built-in error handler for common Elysia errors (PARSE, VALIDATION, NOT_FOUND, etc.)
- 📦 **Lightweight** - Minimal overhead with tree-shakable exports
- 🧪 **Well Tested** - Comprehensive test coverage for reliability

## 📦 Installation

```bash
bun add elysia-http-exception
```

## 🚀 Quick Start

### Basic Setup

```typescript
import { Elysia } from 'elysia';
import { httpExceptionPlugin, NotFoundException, BadRequestException } from 'elysia-http-exception';

const app = new Elysia()
  .use(httpExceptionPlugin())
  .get('/users/:id', ({ params }) => {
    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      throw new BadRequestException('User ID must be a valid number');
    }
    
    if (userId === 404) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    
    return { id: userId, name: `User ${userId}`, email: `user${userId}@example.com` };
  })
  .listen(3000);
```

### Using the Decorator Pattern

```typescript
import { Elysia } from 'elysia';
import { httpExceptionPlugin, NotFoundException, BadRequestException } from 'elysia-http-exception';

const app = new Elysia()
  .use(httpExceptionPlugin())
  .get('/users/:id', ({ params, httpException }) => {
    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return httpException(new BadRequestException('User ID must be a valid number'));
    }
    
    if (userId === 404) {
      return httpException(new NotFoundException(`User with ID ${userId} not found`));
    }
    
    return { id: userId, name: `User ${userId}`, email: `user${userId}@example.com` };
  })
  .listen(3000);
```

## 📚 Available Exception Classes

### 4xx Client Error Exceptions

| Exception Class | Status Code | Description |
|---|---|---|
| `BadRequestException` | 400 | Bad Request |
| `UnauthorizedException` | 401 | Unauthorized |
| `PaymentRequiredException` | 402 | Payment Required |
| `ForbiddenException` | 403 | Forbidden |
| `NotFoundException` | 404 | Not Found |
| `MethodNotAllowedException` | 405 | Method Not Allowed |
| `NotAcceptableException` | 406 | Not Acceptable |
| `RequestTimeoutException` | 408 | Request Timeout |
| `ConflictException` | 409 | Conflict |
| `GoneException` | 410 | Gone |
| `LengthRequiredException` | 411 | Length Required |
| `PreconditionFailedException` | 412 | Precondition Failed |
| `PayloadTooLargeException` | 413 | Payload Too Large |
| `UriTooLongException` | 414 | URI Too Long |
| `UnsupportedMediaTypeException` | 415 | Unsupported Media Type |
| `RangeNotSatisfiableException` | 416 | Range Not Satisfiable |
| `ExpectationFailedException` | 417 | Expectation Failed |
| `ImATeapotException` | 418 | I'm a teapot |
| `MisdirectedRequestException` | 421 | Misdirected Request |
| `UnprocessableEntityException` | 422 | Unprocessable Entity |
| `LockedException` | 423 | Locked |
| `FailedDependencyException` | 424 | Failed Dependency |
| `TooEarlyException` | 425 | Too Early |
| `UpgradeRequiredException` | 426 | Upgrade Required |
| `PreconditionRequiredException` | 428 | Precondition Required |
| `TooManyRequestsException` | 429 | Too Many Requests |
| `RequestHeaderFieldsTooLargeException` | 431 | Request Header Fields Too Large |
| `UnavailableForLegalReasonsException` | 451 | Unavailable For Legal Reasons |

### 5xx Server Error Exceptions

| Exception Class | Status Code | Description |
|---|---|---|
| `InternalServerErrorException` | 500 | Internal Server Error |
| `NotImplementedException` | 501 | Not Implemented |
| `BadGatewayException` | 502 | Bad Gateway |
| `ServiceUnavailableException` | 503 | Service Unavailable |
| `GatewayTimeoutException` | 504 | Gateway Timeout |
| `HttpVersionNotSupportedException` | 505 | HTTP Version Not Supported |
| `VariantAlsoNegotiatesException` | 506 | Variant Also Negotiates |
| `InsufficientStorageException` | 507 | Insufficient Storage |
| `LoopDetectedException` | 508 | Loop Detected |
| `NotExtendedException` | 510 | Not Extended |
| `NetworkAuthenticationRequiredException` | 511 | Network Authentication Required |

## 💡 Usage Examples

### 1. Simple String Messages

```typescript
app.get('/simple', () => {
  throw new BadRequestException('Invalid input provided');
});
```

**Response:**
```json
{
  "statusCode": 400,
  "message": "Invalid input provided"
}
```

### 2. Custom Object Data

```typescript
app.post('/validate', ({ body }) => {
  throw new UnprocessableEntityException({
    error: 'VALIDATION_FAILED',
    details: {
      field: 'email',
      message: 'Invalid email format'
    },
    timestamp: new Date().toISOString()
  });
});
```

**Response:**
```json
{
  "error": "VALIDATION_FAILED",
  "details": {
    "field": "email",
    "message": "Invalid email format"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 3. Error Object Handling

```typescript
app.get('/error-object', () => {
  const validationError = new Error('Database validation failed');
  throw new InternalServerErrorException(validationError);
});
```

**Response:**
```json
{
  "statusCode": 500,
  "message": "Database validation failed"
}
```

### 4. Rate Limiting Example

```typescript
app.get('/api/data', () => {
  const rateLimitExceeded = checkRateLimit(); // Your rate limit logic
  
  if (rateLimitExceeded) {
    throw new TooManyRequestsException({
      message: 'Rate limit exceeded',
      retryAfter: 60,
      limit: 100,
      remaining: 0
    });
  }
  
  return { data: 'Your API data' };
});
```

### 5. Authentication Example

```typescript
app.get('/profile', ({ headers }) => {
  const authHeader = headers['authorization'];
  
  if (!authHeader) {
    throw new UnauthorizedException({
      error: 'MISSING_AUTH_HEADER',
      message: 'Authorization header is required',
      requiredFormat: 'Bearer <token>'
    });
  }
  
  if (!authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedException('Invalid authorization format');
  }
  
  return { user: { id: 1, name: 'John Doe' } };
});
```

### 6. File Upload Example

```typescript
app.post('/upload', ({ request }) => {
  const contentLength = parseInt(request.headers.get('content-length') || '0');
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (contentLength > maxSize) {
    throw new PayloadTooLargeException({
      error: 'FILE_TOO_LARGE',
      message: 'File size exceeds maximum allowed size',
      maxSize: `${maxSize / 1024 / 1024}MB`,
      receivedSize: `${(contentLength / 1024 / 1024).toFixed(2)}MB`
    });
  }
  
  return { message: 'Upload successful' };
});
```

### 7. E-commerce Example

```typescript
app.post('/checkout', ({ body }) => {
  const data = body as any;
  
  if (!data.items?.length) {
    throw new BadRequestException({
      error: 'EMPTY_CART',
      message: 'Cart cannot be empty for checkout'
    });
  }
  
  const outOfStockItem = data.items.find((item: any) => !item.inStock);
  if (outOfStockItem) {
    throw new ConflictException({
      error: 'ITEM_OUT_OF_STOCK',
      message: 'Some items in your cart are no longer available',
      unavailableItems: [outOfStockItem]
    });
  }
  
  return { message: 'Checkout successful', orderId: 'order-123' };
});
```

## 🔧 Built-in Error Handling

The plugin automatically handles common Elysia errors:

- **PARSE**: JSON parsing errors → 400 Bad Request
- **VALIDATION**: Schema validation errors → 400 Bad Request  
- **NOT_FOUND**: Route not found → 404 Not Found
- **INVALID_COOKIE_SIGNATURE**: Invalid cookies → 400 Bad Request
- **INVALID_FILE_TYPE**: Unsupported file types → 415 Unsupported Media Type

## 🏗️ API Reference

### `httpExceptionPlugin()`

The main plugin function that adds HTTP exception handling to your Elysia app.

```typescript
import { httpExceptionPlugin } from 'elysia-http-exception';

const app = new Elysia().use(httpExceptionPlugin());
```

### `HttpException` Base Class

All exception classes extend from the base `HttpException` class:

```typescript
class HttpException extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly data?: unknown;
  public readonly isHttpException = true;
  
  constructor(httpError: HttpError, message?: string | object | Error | unknown);
  toBody(): unknown;
}
```

### Exception Constructor Parameters

Each exception class accepts an optional message parameter:

- **string**: Simple error message
- **object**: Custom error data (returned as-is in response)
- **Error**: Error instance (uses error.message)
- **undefined**: Uses default message for the status code

## 🧪 Testing

The plugin includes comprehensive tests. Run them with:

```bash
# Run all tests
bun test

# Run unit tests only
bun test:unit

# Run e2e tests only
bun test:e2e

# Run tests with coverage
bun test:coverage

# Watch mode
bun test:watch
```

## 📋 Examples

Check out the comprehensive examples in the `/example` directory:

- **example-throw.ts**: Demonstrates using `throw` statements
- **example-decorator.ts**: Demonstrates using the `httpException` decorator

Run the examples:

```bash
cd example
bun run example-throw.ts     # Server on http://localhost:3000
bun run example-decorator.ts # Server on http://localhost:3001
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Elysia](https://elysiajs.com/) - The fast and friendly Bun web framework
- [HTTP Status Codes](https://httpstatuses.com/) - For comprehensive status code reference
- The Bun and TypeScript communities for their excellent tooling

## 🔗 Links

- [GitHub Repository](https://github.com/codev911/elysia-http-exception)
- [npm Package](https://www.npmjs.com/package/elysia-http-exception)
- [Elysia Documentation](https://elysiajs.com/introduction.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---
