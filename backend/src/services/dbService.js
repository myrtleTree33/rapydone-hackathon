import mongoose from 'mongoose';
import log from '../log.js';

export const initDb = async (uri) => {
  const instance = await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const a = 3;

  log.info(`Connected to DB at uri=${uri}`);
  return Promise.resolve(instance);
};
