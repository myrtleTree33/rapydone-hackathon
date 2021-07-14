import HttpErrors from 'http-errors';
import { addOrder } from '../../services/orderService.js';
import {
  decrementProductInventory,
  findProduct,
} from '../../services/productService.js';

async function routes(fastify, opts) {
  fastify.post('/', async (request, reply) => {
    const { productId, buyerId, quantity } = request.body;
    const product = await findProduct(productId);

    if (!product) {
      return Promise.resolve(
        HttpErrors.BadRequest('Product cannot be found'),
      );
    }

    if (quantity <= 0) {
      return Promise.resolve(
        HttpErrors.BadRequest(
          'Quantity purchased must be a positive integer',
        ),
      );
    }

    if (product.numRemaining - quantity < 0) {
      return Promise.resolve(
        HttpErrors.BadRequest('Product inventory exhausted'),
      );
    }

    const [order, _] = await Promise.all([
      addOrder({
        productId,
        buyerId,
        quantity,
      }),
      decrementProductInventory(productId, quantity),
    ]);

    return Promise.resolve(order);
  });
}

export default routes;
