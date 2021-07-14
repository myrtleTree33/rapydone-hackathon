# Sample Backend Server

The following implements a basic shop backend in NodeJS.

## Technology stack

The following tech stack is used:

- Fastify: Leaner and faster server library (as compared to Express JS)
- ESLint: Type checking and correction
- ESLint AirBnb styling
- Prettier: Standardizes code formatting
- Pino: Performant logging supporting redaction
- Mongoose: MongoDB DB ORM (An interface is used to decouple DB implementation)
- Jest: Tests

## Scripts

- `start` - starts the app
- `test` - run Jest tests
- `test:watch` - run tests in watch mode
- `format` - formats the code by running prettier and eslint; useful for git pre-commit hooks

## API Documentation

Import the following Postman request: https://www.getpostman.com/collections/261bf26f934781f6ab48

## Credit

https://github.com/myrtleTree33/node-starter-app