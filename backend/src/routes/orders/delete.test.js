import Fastify from 'fastify';
import { addOrder } from '../../services/orderService.js';
import { addProduct } from '../../services/productService.js';
import { clearDb, closeDb, connectDb } from '../../utilities.js';
import routes from './delete.js';

describe('delete order', () => {
  let app;

  beforeAll(async () => {
    await connectDb();
    app = Fastify();
    app.register(routes);

    return Promise.resolve();
  });

  afterEach(async () => clearDb());

  afterAll(async () => {
    await app.close();
    await closeDb();
  });

  describe('when given a valid order id', () => {
    it('should delete the order and return it', async () => {
      const product = await addProduct({
        title: 'monopoly',
        description: 'some game',
        category: 'games',
        numRemaining: 5,
      });

      const { _id } = product;

      const order = await addOrder({
        productId: _id,
        buyerId: 'user_132',
        quantity: 3,
      });

      const { _id: orderId } = order;

      const response = await app.inject({
        method: 'DELETE',
        url: `/${orderId}`,
      });

      const body = response.json();

      expect(body.quantity).toBe(3);
      // eslint-disable-next-line no-underscore-dangle
      expect(body._id).toBeDefined();
      expect(body.buyerId).toBeDefined();
      expect(body.productId).toBeDefined();
      expect(body.datePurchased).toBeDefined();
      expect(body.dateCancelled).toBeDefined();
    });
  });

  describe('when the order id is invalid', () => {
    it('should return a null order', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/INVALID_ORDER_ID',
      });

      const body = response.json();

      expect(body).toBeNull();
    });
  });
});
