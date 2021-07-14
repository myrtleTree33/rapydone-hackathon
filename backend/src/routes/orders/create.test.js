import Fastify from 'fastify';
import { addProduct } from '../../services/productService.js';
import { clearDb, closeDb, connectDb } from '../../utilities.js';
import routes from './create.js';

describe('create order', () => {
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
  describe('when given a valid product id', () => {
    it('should return the correct response', async () => {
      const product = await addProduct({
        title: 'monopoly',
        description: 'some game',
        category: 'games',
        numRemaining: 5,
      });

      const { _id } = product;

      const response = await app.inject({
        method: 'POST',
        url: '/',
        body: {
          productId: _id,
          buyerId: 'user_123',
          quantity: 5,
        },
      });

      const body = response.json();

      expect(body.quantity).toBe(5);
      expect(body.buyerId).toBeDefined();
      expect(body.productId).toBeDefined();
      expect(body.datePurchased).toBeDefined();
    });
  });

  describe('when given an invalid product id', () => {
    it('should throw an error', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/',
        body: {
          productId: '123123',
          buyerId: 'user_123',
          quantity: 5,
        },
      });

      const body = response.json();

      expect(body.statusCode).toBe(400);
      expect(body.message).toBe('Product cannot be found');
    });
  });

  describe('when quantity purchased is more than the inventory', () => {
    it('should throw an error', async () => {
      const product = await addProduct({
        title: 'monopoly',
        description: 'some game',
        category: 'games',
        numRemaining: 5,
      });

      const { _id } = product;

      const response = await app.inject({
        method: 'POST',
        url: '/',
        body: {
          productId: _id,
          buyerId: 'user_123',
          quantity: 6,
        },
      });

      const body = response.json();

      expect(body.statusCode).toBe(400);
      expect(body.message).toBe('Product inventory exhausted');
    });
  });

  describe('when quantity purchased is negative', () => {
    it('should throw an error', async () => {
      const product = await addProduct({
        title: 'monopoly',
        description: 'some game',
        category: 'games',
        numRemaining: 5,
      });

      const { _id } = product;

      const response = await app.inject({
        method: 'POST',
        url: '/',
        body: {
          productId: _id,
          buyerId: 'user_123',
          quantity: -1,
        },
      });

      const body = response.json();

      expect(body.statusCode).toBe(400);
      expect(body.message).toBe(
        'Quantity purchased must be a positive integer',
      );
    });
  });

  describe('when quantity purchased is equal to the inventory', () => {
    it('should throw an error', async () => {
      const product = await addProduct({
        title: 'monopoly',
        description: 'some game',
        category: 'games',
        numRemaining: 5,
      });

      const { _id } = product;

      const response = await app.inject({
        method: 'POST',
        url: '/',
        body: {
          productId: _id,
          buyerId: 'user_123',
          quantity: 5,
        },
      });

      const body = response.json();

      expect(body.quantity).toBe(5);
      expect(body.buyerId).toBeDefined();
      expect(body.productId).toBeDefined();
      expect(body.datePurchased).toBeDefined();
    });
  });
});
