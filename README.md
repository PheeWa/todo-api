# Todo API

A RESTful Todo API built with Fastify and TypeScript, featuring owner-based authorization.

## Features

- **Authentication & Authorization**: Token-based auth with owner-based access control
- **CRUD Operations**: Full todo management (Create, Read, Update, Delete)
- **Type Safety**: Built with TypeScript and runtime schema validation
- **Docker Support**: Containerized application ready for deployment
- **CI/CD Pipeline**: Automated testing with GitHub Actions
- **Pre-commit Hooks**: Automated testing before commits using Husky
- **Error Handling**: Consistent error responses using @fastify/sensible

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Fastify
- **Language**: TypeScript
- **Validation**: @sinclair/typebox
- **Testing**: Jest
- **Containerization**: Docker
- **CI/CD**: GitHub Actions

## Prerequisites

- Node.js 20 or higher
- npm or yarn
- Docker (optional)

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd todo-api

# Install dependencies
npm install
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The server will start at `http://localhost:8080`

### Production Mode

```bash
# Build the project
npm run build

# Start the server
npm start
```

### Using Docker

```bash
# Start the application
docker-compose up

# Start in detached mode (background)
docker-compose up -d

# Stop the application
docker-compose down
```

## API Endpoints

### Health Check

```bash
GET /health
```

Returns the health status of the API.

### Authentication

#### Login

```bash
POST /login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**

```json
{
  "token": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Test Credentials:**

- Admin: `username: alice, password: admin123`
- User: `username: bob, password: user123`

### Todos

All todo endpoints require authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

#### Get All Todos

```bash
GET /todos
Authorization: Bearer <token>
```

#### Create Todo

```bash
POST /todos
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Buy groceries"
}
```

#### Get Todo by ID

```bash
GET /todos/:id
Authorization: Bearer <token>
```

#### Update Todo

```bash
PATCH /todos/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Buy groceries and cook dinner",
  "isCompleted": true
}
```

#### Delete Todo

```bash
DELETE /todos/:id
Authorization: Bearer <token>
```

## Authorization

This API uses owner-based authorization:

- Users can only view, update, and delete their own todos
- Each todo is associated with the user who created it (via `userId`)
- Cross-user access is prevented at the service layer through ownership checks

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Development Workflow

This project uses Husky for git hooks:

- **Pre-commit**: Automatically runs tests before each commit
- **CI/CD**: GitHub Actions runs tests on push/PR to main branch

## Project Structure

```
todo-api/
├── __test__/           # Test files
├── middleware/         # Custom middleware (auth, error handling)
├── routes/            # API route handlers
├── schemas/           # Request/response schemas
├── services/          # Business logic
├── types/             # TypeScript type definitions
├── index.ts           # Application entry point
└── Dockerfile         # Docker configuration
```

## Error Responses

The API uses consistent error responses:

- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Unexpected server error

## Future Enhancements

- Complete test coverage for all API endpoints (POST, GET/:id, PATCH, DELETE)
- User registration endpoint
- Password reset functionality
- Persistent data storage (database integration)
- Request rate limiting
- API documentation with Swagger/OpenAPI
