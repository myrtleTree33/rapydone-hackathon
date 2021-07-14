import Fastify from 'fastify';
import { clearDb, closeDb, connectDb } from '../../utilities.js';
import routes from './create.js';

describe('create product', () => {
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
  describe('when given valid fields', () => {
    it('should return the correct response', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/',
        body: {
          title: 'monopoly',
          description: 'some game',
          category: 'games',
          numRemaining: 5,
        },
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
});
