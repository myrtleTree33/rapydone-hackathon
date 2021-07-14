import {
  deleteOrder,
  findOrder,
} from '../../services/orderService.js';
import { incrementProductInventory } from '../../services/productService.js';

async function routes(fastify, opts) {
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params;

    const foundOrder = await findOrder(id);

    if (!foundOrder) {
      return Promise.resolve(null);
    }

    const { productId, quantity } = foundOrder;

    const [order, _] = await Promise.all([
      deleteOrder(id),
      incrementProductInventory(productId, quantity),
    ]);

    return Promise.resolve(order);
  });
}

export default routes;
