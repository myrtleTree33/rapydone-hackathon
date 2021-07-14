import { addProduct } from '../../services/productService.js';

async function routes(fastify, opts) {
  fastify.post('/', async (request, reply) => {
    const { title, description, category, numRemaining } =
      request.body;

    const product = await addProduct({
      title,
      description,
      category,
      numRemaining,
    });

    return Promise.resolve(product);
  });
}

export default routes;
