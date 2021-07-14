import Fastify from 'fastify';
import { addProduct } from '../../services/productService.js';
import { clearDb, closeDb, connectDb } from '../../utilities.js';
import routes from './readAll.js';

describe('find all products', () => {
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

  describe('when given a valid filter', () => {
    it('should return the matched products', async () => {
      await addProduct({
        title: 'monopoly',
        description: 'some game',
        category: 'games',
        numRemaining: 5,
      });

      await addProduct({
        title: 'scrabble',
        description: 'some game',
        category: 'games',
        numRemaining: 5,
      });

      await addProduct({
        title: 'spoon',
        description: 'for eating',
        category: 'kitchenware',
        numRemaining: 5,
      });

      const response = await app.inject({
        method: 'POST',
        url: '/query',
        body: { category: 'games' },
      });

      const body = response.json();

      expect(body.length).toBe(2);
    });
  });

  describe('when given no filter', () => {
    it('should return all products', async () => {
      await Promise.all([
        addProduct({
          title: 'monopoly',
          description: 'some game',
          category: 'games',
          numRemaining: 5,
        }),

        addProduct({
          title: 'scrabble',
          description: 'some game',
          category: 'games',
          numRemaining: 5,
        }),

        addProduct({
          title: 'scrabble',
          description: 'some game',
          category: 'games',
          numRemaining: 5,
        }),
      ]);

      const response = await app.inject({
        method: 'POST',
        url: '/query',
      });

      const body = response.json();

      expect(body.length).toBe(3);
    });
  });

  describe('when the number of requests exceeds the page limit', () => {
    it('should return all products and constrain to the page limit', async () => {
      const productsPromises = [];

      for (let i = 0; i < 50; i++) {
        productsPromises.push(
          addProduct({
            title: 'monopoly',
            description: 'some game',
            category: 'games',
            numRemaining: 5,
          }),
        );
      }

      await Promise.all(productsPromises);

      const response = await app.inject({
        method: 'POST',
        url: '/query',
      });

      const body = response.json();

      expect(body.length).toBe(20);
    });
  });
});
