import Fastify from 'fastify';
import makePromisesSafe from 'make-promises-safe';
import path from 'path';
import App from './app.js';
import log from './log.js';

// Allow core-dump on uncaught Promise.rejects
makePromisesSafe.abort = true;

// Expose __dirname as ESM modules do not support this out-of-box
// eslint-disable-next-line no-underscore-dangle
const __dirname = `/${path
  .dirname(import.meta.url)
  .replace(/^file:\/\/\//, '')}`;

const fastify = Fastify({ logger: log });
App(fastify, __dirname);

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000);
  } catch (err) {
    fastify.log.error(err);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
};

start();
