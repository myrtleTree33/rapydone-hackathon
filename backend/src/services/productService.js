import Product from '../models/Product.js';

export const addProduct = async ({
  title,
  description,
  category,
  numRemaining,
}) => {
  const product = new Product({
    title,
    description,
    category,
    numRemaining,
  });

  return Promise.resolve(product.save());
};

export const removeProduct = async (id) => {
  const product = await Product.findOneAndUpdate(
    { _id: id, dateDeleted: null },
    { dateDeleted: Date.now() },
    { upsert: false, useFindAndModify: false, new: true },
  );
  return Promise.resolve(product);
};

export const incrementProductInventory = async (id, amount) => {
  const product = await Product.findOneAndUpdate(
    { _id: id, dateDeleted: null },
    { $inc: { numRemaining: amount } }, // Increment by the specified amount
    { upsert: false, useFindAndModify: false, new: true },
  );
  return Promise.resolve(product);
};

export const decrementProductInventory = async (id, amount) =>
  incrementProductInventory(id, amount * -1);

export const findProduct = async (id) => {
  const product = await Product.findOne({
    _id: id,
    dateDeleted: null,
  });
  return Promise.resolve(product);
};

export const findProducts = async (
  query = {},
  limit = 20,
  offset = 0,
) => {
  const queryCombined = { ...query, dateDeleted: null };
  const products = await Product.find(queryCombined)
    .limit(limit)
    .skip(offset);

  return Promise.resolve(products);
};

export const modifyProduct = async (id, newData = {}) => {
  const product = await Product.findOneAndUpdate(
    { _id: id, dateDeleted: null },
    newData,
    { upsert: false, useFindAndModify: false, new: true },
  );
  return Promise.resolve(product);
};
