# Todo API

A RESTful Todo API built with Fastify and TypeScript, featuring owner-based authorization.

## Features

- **Authentication & Authorization**: JWT-based authentication with UUID-based user identification and owner-based access control
- **PostgreSQL Database**: Persistent data storage with PostgreSQL
- **Database Migrations**: Version-controlled schema migrations
- **CRUD Operations**: Full todo management (Create, Read, Update, Delete)
- **Type Safety**: Built with TypeScript and runtime schema validation
- **Docker Support**: Containerized application with PostgreSQL ready for deployment
- **CI/CD Pipeline**: Automated testing with GitHub Actions
- **Pre-commit Hooks**: Automated testing before commits using Husky
- **Error Handling**: Consistent error responses using @fastify/sensible

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Fastify
- **Language**: TypeScript
- **Database**: PostgreSQL 16
- **Database Client**: node-postgres (pg)
- **Authentication**: JWT (@fastify/jwt)
- **Password Hashing**: bcrypt
- **Validation**: @sinclair/typebox
- **Testing**: Jest
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions

## Prerequisites

- Node.js 20 or higher
- npm or yarn
- Docker and Docker Compose (required for PostgreSQL)

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd todo-api

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your JWT_SECRET and DATABASE_URL
```

## Database Setup

### 1. Start PostgreSQL

```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Verify PostgreSQL is running
docker-compose ps
```

### 2. Run Migrations

```bash
# Run database migrations to create tables
npm run migrate
```

### 3. Seed Test Data (Optional)

```bash
# Seed database with test users (alice and bob)
npm run seed
```

This will create two test users:

- **alice** / admin123 (UUID: `550e8400-e29b-41d4-a716-446655440001`)
- **bob** / user123 (UUID: `550e8400-e29b-41d4-a716-446655440002`)

## Running the Application

### Development Mode

```bash
# Start PostgreSQL (if not already running)
docker-compose up -d postgres

# Start the application in development mode
npm run dev
```

The server will start at `http://localhost:8080`

### Production Mode

```bash
# Start PostgreSQL
docker-compose up -d postgres

# Build the project
npm run build

# Start the server
npm start
```

### Using Docker Compose (Full Stack)

```bash
# Start both PostgreSQL and the application
docker-compose up

# Start in detached mode (background)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v
```

## API Endpoints

### Health Check

```bash
GET /health
```

Returns the health status of the API.

### Authentication

#### Register

```bash
POST /register
Content-Type: application/json

{
  "username": "alice",
  "password": "admin123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNoYXJsaWUxIiwiaWF0IjoxNzY0NDkyNDM5LCJleHAiOjE3NjUwOTcyMzl9.dc0ag1KSt5jycYKk2gSnT039dZQeWQjlJE_JSu-_1e4",
  "username": "alice"
}
```

#### Login

```bash
POST /login
Content-Type: application/json

{
  "username": "alice",
  "password": "admin123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsaWNlIiwiaWF0IjoxNzM...",
  "username": "alice"
}
```

**Test Credentials:**

- User 1: `username: alice, password: admin123`
- User 2: `username: bob, password: user123`

#### Get Current User

```bash
GET /me
Authorization: Bearer <token>
```

Returns information about the currently authenticated user.

**Response:**

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440001",
  "username": "alice"
}
```

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
- Cross-user access is prevented at both the database and service layer through ownership checks
- Database queries include `WHERE user_id = $1` clauses to ensure data isolation

## Architecture

The following diagram illustrates the layered architecture of the Todo API:

![Architecture Diagram](doc/architecture-diagram.png)

The application follows a layered architecture pattern:

- **Entry Point** (`index.ts`): Initializes the Fastify server with configuration, JWT, and global error handling
- **Routes Layer**: Handles HTTP requests (public auth routes, health checks, and protected todo routes)
- **Service Layer**: Contains business logic for authentication and todo management with PostgreSQL queries
- **Schema Layer**: Defines request/response validation schemas using TypeBox
- **Data Layer**: PostgreSQL database with connection pooling
- **Migration Layer**: Version-controlled SQL schema migrations

## Testing

The test suite includes unit tests and integration tests that connect to the PostgreSQL database.

```bash
# Ensure PostgreSQL is running
docker-compose up -d postgres

# Run database migrations
npm run migrate

# Seed test data
npm run seed

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

**Note**: Tests use the same database as development. The test suite uses the seeded test users (alice and bob) for integration testing.

## Development Workflow

This project uses Husky for git hooks:

- **Pre-commit**: Automatically runs tests before each commit
- **CI/CD**: GitHub Actions runs tests on push/PR to main branch

## Project Structure

```
todo-api/
├── __test__/           # Test files
│   ├── routes/         # Route integration tests
│   └── services/       # Service unit tests
├── .github/            # GitHub Actions/workflows configuration
├── .husky/             # Git hook configuration (e.g., pre-commit hooks)
├── config/             # Configuration files
│   ├── database.ts     # PostgreSQL connection pool
│   └── env.ts          # Environment variable validation
├── dist/               # Compiled JavaScript output directory
├── doc/                # Documentation and diagrams
├── migrations/         # Database schema migrations
│   ├── 001_create_users_table.sql
│   └── 002_create_todos_table.sql
├── middleware/         # Custom middleware (auth, error handling)
├── node_modules/       # Project dependencies
├── routes/             # Fastify API route handlers
├── schemas/            # Request/response validation schemas
├── scripts/            # Database scripts
│   ├── migrate.ts      # Migration runner
│   └── seed.ts         # Database seeder
├── services/           # Business logic and PostgreSQL queries
├── types/              # TypeScript type definitions
├── .dockerignore       # Files to exclude when building the Docker image
├── .env                # Environment variables (JWT_SECRET, DATABASE_URL)
├── .gitignore          # Files and directories to exclude from Git tracking
├── docker-compose.yml  # Docker Compose configuration (app + PostgreSQL)
├── Dockerfile          # Docker configuration to build the application image
├── index.ts            # Application entry point
├── jest.config.js      # Jest testing framework configuration
├── jest.setup.js       # Jest setup file (loads environment variables)
├── package-lock.json   # Exact dependency versions locked by npm
├── package.json        # Project metadata, scripts, and dependency list
├── README.md           # Project documentation
├── test.http           # HTTP request examples for manual testing
└── tsconfig.json       # TypeScript compiler configuration
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# JWT Secret (change this to a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Database Connection
DATABASE_URL=postgresql://todouser:todopassword@localhost:5432/tododb

# Server Configuration (optional)
PORT=8080
HOST=0.0.0.0
```

## Error Responses

The API uses consistent error responses:

- `400 Bad Request`: Invalid request body or parameters
- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: Resource not found
- `409 Conflict`: Duplicate resource (e.g., username already exists)
- `500 Internal Server Error`: Unexpected server error

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Todos Table

```sql
CREATE TABLE todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with test users
