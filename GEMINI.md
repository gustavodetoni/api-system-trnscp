# GEMINI.md

## Project Overview

This project is a REST API built with [ElysiaJS](https://elysiajs.com/), a web framework for [Bun](https://bun.sh/). It uses [Drizzle ORM](https://orm.drizzle.team/) for type-safe database access to a PostgreSQL database. The API provides endpoints for user authentication and managing squads, including CRUD operations and member management.

The project is structured as follows:

*   `src/core`: Contains the core business logic of the application, including entities, repositories, and use cases.
*   `src/infra`: Contains the infrastructure-level code, such as the database configuration, repositories implementation, and API routes.
*   `src/shared`: Contains shared code that can be used across different parts of the application, such as authentication middleware and error handling.
*   `tests`: Contains the tests for the application.

## Building and Running

To build and run this project, you will need to have [Bun](https://bun.sh/) installed.

1.  **Install dependencies:**

    ```bash
    bun install
    ```

2.  **Set up environment variables:**

    Create a `.env` file in the root of the project and add the following environment variables:

    ```
    DATABASE_URL=...
    JWT_SECRET=...
    ```

3.  **Run database migrations:**

    ```bash
    bun run migrate
    ```

4.  **Run the development server:**

    ```bash
    bun run dev
    ```

    The server will be running at `http://localhost:3333`.

## Development Conventions

### Testing

The project uses [Vitest](https://vitest.dev/) for testing. To run the tests, use the following command:

```bash
bun run test
```

To run the tests with coverage, use the following command:

```bash
bun run coverage
```

### API Documentation

The project uses `@elysiajs/swagger` to generate API documentation. The documentation is available at `http://localhost:3333/swagger`.

### Database

The project uses [Drizzle ORM](https://orm.drizzle.team/) to interact with the database. The database schema is defined in `src/infra/database/schema.ts`.

To generate the Drizzle ORM files, use the following command:

```bash
bun run generate
```

To open Drizzle Studio, use the following command:

```bash
bun run studio
```
