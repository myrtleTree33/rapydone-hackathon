import Fastify from 'fastify';
import { addProduct } from '../../services/productService.js';
import { clearDb, closeDb, connectDb } from '../../utilities.js';
import routes from './update.js';

describe('update product', () => {
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

  describe('when given a valid product id and the requested changes', () => {
    it('should return the product', async () => {
      const product = await addProduct({
        title: 'monopoly',
        description: 'some game',
        category: 'games',
        numRemaining: 5,
      });

      const { _id } = product;

      const response = await app.inject({
        method: 'PUT',
        url: `/${_id}`,
        body: {
          title: 'scrabble',
          description: 'some other description',
          category: 'games',
          numRemaining: 5,
        },
      });

      const body = response.json();

      // eslint-disable-next-line no-underscore-dangle
      expect(body._id).toBe(_id);
      expect(body.title).toBe('scrabble');
      expect(body.description).toBe('some other description');
      expect(body.category).toBe('games');
      expect(body.numRemaining).toBe(5);
    });
  });

  describe('when given an invalid product id and the requested changes', () => {
    it('should return null', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: 'INVALID_PRODUCT_ID',
        body: {
          title: 'scrabble',
          description: 'some other description',
          category: 'games',
          numRemaining: 5,
        },
      });

      const body = response.json();

      expect(body).toBe(null);
    });
  });
});
