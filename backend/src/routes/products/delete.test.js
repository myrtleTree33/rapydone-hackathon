import Fastify from 'fastify';
import { addProduct } from '../../services/productService.js';
import { clearDb, closeDb, connectDb } from '../../utilities.js';
import routes from './delete.js';

describe('delete product', () => {
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

  describe('when provided with a valid product ID', () => {
    it('should return the correct response', async () => {
      const product = await addProduct({
        title: 'monopoly',
        description: 'some game',
        category: 'games',
        numRemaining: 5,
      });

      const { _id } = product;

      const response = await app.inject({
        method: 'DELETE',
        url: `/${_id}`,
      });

      const body = response.json();

      // eslint-disable-next-line no-underscore-dangle
      expect(body._id).toBeDefined();
      expect(body.title).toBe('monopoly');
      expect(body.description).toBe('some game');
      expect(body.category).toBe('games');
      expect(body.numRemaining).toBe(5);
    });
  });

  describe('when provided with an invalid product ID', () => {
    it('should return the correct response', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: `/INVALID_PRODUCT_ID`,
      });

      const body = response.json();

      expect(body).toBeNull();
    });
  });
});
