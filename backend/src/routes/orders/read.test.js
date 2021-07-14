import Fastify from 'fastify';
import { addOrder } from '../../services/orderService.js';
import { addProduct } from '../../services/productService.js';
import { clearDb, closeDb, connectDb } from '../../utilities.js';
import routes from './read.js';

describe('find order', () => {
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
    it('should return the order', async () => {
      const order = await addOrder({
        productId: '123',
        buyerId: '123',
        quantity: 2,
      });

      const { _id } = order;

      const response = await app.inject({
        method: 'GET',
        url: `/${_id}`,
      });

      const body = response.json();

      expect(body.quantity).toBe(2);
      expect(body.buyerId).toBeDefined();
      expect(body.productId).toBeDefined();
      expect(body.datePurchased).toBeDefined();
      expect(body.dateCancelled).toBeUndefined();
    });
  });

  describe('when given an invalid order id', () => {
    it('should return the order', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/INVALID_ORDER_ID',
      });

      const body = response.json();

      expect(body).toBeNull();
    });
  });
});
