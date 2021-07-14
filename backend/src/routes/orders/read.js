import { findOrder } from '../../services/orderService.js';

async function routes(fastify, opts) {
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params;
    const order = await findOrder(id);
    return Promise.resolve(order);
  });
}

export default routes;
