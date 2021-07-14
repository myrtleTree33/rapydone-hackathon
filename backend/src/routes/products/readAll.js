import fastifyPagination from 'fastify-pagination';
import { findProducts } from '../../services/productService.js';

async function routes(fastify, opts) {
  fastify
    .register(fastifyPagination)
    .post('/query', async (request, reply) => {
      const { limit = 0, offset = 0 } = request.parsePagination();
      const query = request.body || {};
      const products = await findProducts(query, limit, offset);

      return Promise.resolve(products);
    });
}

export default routes;
