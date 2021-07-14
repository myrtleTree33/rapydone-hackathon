import autoload from 'fastify-autoload';
import path from 'path';
import helmet from 'fastify-helmet';
import dbDecorator from './decorators/dbDecorator.js';

const { DB_URI: dbUri } = process.env;

function App(fastify, dirname) {
  fastify.register(dbDecorator, { dbUri });

  // Enable Helmet for endpoint best-practices by Helmet
  // Disable content security policy for routes
  fastify.register(helmet, { contentSecurityPolicy: false });

  // Bind routes based on directory
  fastify.register(autoload, {
    dir: path.join(dirname, 'routes'),
    ignorePattern: /.*test.js/,
  });
}

export default App;
