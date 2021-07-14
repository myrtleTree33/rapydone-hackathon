import fp from 'fastify-plugin';
import { initDb } from '../services/dbService.js';

async function dbDecorator(fastify, opts) {
  const { dbUri } = opts;
  const db = initDb(dbUri);
  fastify.decorate('conf', { db });
}

export default fp(dbDecorator);
