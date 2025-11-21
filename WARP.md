# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview
Habit Sumaq Backend is an expense management application backend built with Express.js, TypeORM, and PostgreSQL. The project uses TypeScript with strict null checks and experimental decorators enabled.

## Development Commands

### Setup
```pwsh
# Start PostgreSQL database with Docker
docker run --name exm-container -e POSTGRES_USER=xiza -e POSTGRES_PASSWORD=xiza -e POSTGRES_DB=exm-db -p 5432:5432 -d postgres

# Copy environment template and configure
Copy-Item .env.template .env
```

### Development
```pwsh
# Run development server with watch mode (auto-restart on changes)
npm run dev

# Build for production
npm run build

# Start production server (builds first)
npm run start

# Clean build artifacts
npm run clean
```

### Code Quality
```pwsh
# Run linter
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format
```

### Testing
```pwsh
# Run all tests once
npm run test

# Run tests in watch mode
npm run test:dev

# Run tests with coverage report
npm run test:cov

# Run full validation (lint + test + build)
npm run check
```

### Database
```pwsh
# Run TypeORM CLI commands
npm run typeorm <command>
```

## Architecture Overview

### Module Structure
The codebase follows a modular architecture where each feature is self-contained within `src/api/<module>`. Each module contains:

- **controllers/**: HTTP request handlers that orchestrate service calls
- **services/**: Business logic layer, returns `ServiceResponse` objects
- **repositories/**: Data access layer (TypeORM repositories)
- **entities/**: TypeORM entities (database models)
- **routes/**: Express router configuration with OpenAPI documentation
- **domain/**: Request/response schemas (Zod), DTOs, and domain models
- **middlewares/**: Module-specific middleware
- **utils/**: Module-specific utility functions
- **seeds/**: Database seeders
- **subscribers/**: TypeORM entity subscribers

Current modules: `auth`, `account`, `transaction`, `util`

### Core Patterns

#### ServiceResponse Pattern
All service methods return a `ServiceResponse<T>` object that encapsulates:
- `success`: boolean indicating success/failure
- `message`: human-readable message
- `responseObject`: typed response data (T)
- `statusCode`: HTTP status code
- `code`: application-specific error/success code (from `code-mapper.map.ts`)

Controllers use `handleServiceResponse()` to automatically convert ServiceResponse to HTTP responses.

#### Request/Response Flow
1. Route definition registers OpenAPI spec using `OpenAPIRegistry`
2. Request hits route with `authenticate` middleware (validates bearer token)
3. `validateRequest()` middleware validates request against Zod schema
4. Controller extracts data and calls service
5. Service performs business logic and returns `ServiceResponse`
6. `handleServiceResponse()` sends HTTP response

#### Authentication
- Token-based authentication using `AuthToken` entity
- `authenticate` middleware validates bearer tokens and attaches `req.decodedUser`
- `adminOnly` middleware restricts access to admin users

#### Path Aliases
The project uses `@/` as an alias for `src/`. This is configured in `tsconfig.json` and works with `vite-tsconfig-paths`.

### Database
- **ORM**: TypeORM with PostgreSQL
- **Synchronization**: Currently using `synchronize: true` (auto-schema updates)
- **Seeders**: Automatically run on application start using `typeorm-extension`
- **Connection**: Configured via environment variables in `src/data-source.ts`

### API Documentation
- OpenAPI/Swagger documentation auto-generated from Zod schemas
- Each route registers its spec using `@asteasolutions/zod-to-openapi`
- Documentation available via `openAPIRouter` endpoint

### Key Directories
- `src/config/`: Server configuration, environment variables, routes, logging
- `src/middlewares/`: Global middleware (error handler, rate limiter, request logger)
- `src/domain/`: Shared domain models, enums, and response types
- `src/utils/`: Shared utility functions
- `src/types/`: TypeScript type definitions and extensions

## Important Notes

### Code Style
- Use the existing `ServiceResponse` pattern for all service methods
- All routes must register OpenAPI documentation
- Use Zod schemas for request/response validation
- Follow the modular structure when adding new features

### Testing
- Tests use Vitest with global test functions
- Coverage excludes config files, models, and interfaces (see `vite.config.mts`)
- No test files currently exist in the codebase

### TypeScript Configuration
- Strict null checks enabled but general strict mode disabled
- Decorators are required for TypeORM entities
- Imports not used as values are removed during compilation
