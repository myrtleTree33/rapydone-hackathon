import { removeProduct } from '../../services/productService.js';

async function routes(fastify, opts) {
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params;
    const product = await removeProduct(id);
    return Promise.resolve(product);
  });
}

export default routes;
