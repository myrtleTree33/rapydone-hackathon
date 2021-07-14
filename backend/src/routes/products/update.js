import HttpErrors from 'http-errors';
import { modifyProduct } from '../../services/productService.js';

async function routes(fastify, opts) {
  fastify.put('/:id', async (request, reply) => {
    const { title, description, category, numRemaining } =
      request.body;
    const { id } = request.params;

    if (!id) {
      return Promise.resolve(
        HttpErrors.BadRequest('Please specify an id'),
      );
    }

    const product = await modifyProduct(id, {
      title,
      description,
      category,
      numRemaining,
    });

    return Promise.resolve(product);
  });
}

export default routes;
