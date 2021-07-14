import HttpErrors from 'http-errors';
import { findProduct } from '../../services/productService.js';

async function routes(fastify, opts) {
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params;

    if (!id) {
      return Promise.resolve(
        HttpErrors.BadRequest('Please specify an id'),
      );
    }

    const product = await findProduct(id);
    return Promise.resolve(product);
  });
}

export default routes;
