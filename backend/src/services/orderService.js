import Order from '../models/Order.js';

export const addOrder = async ({ productId, buyerId, quantity }) => {
  const order = new Order({
    productId,
    buyerId,
    quantity,
  });

  return Promise.resolve(order.save());
};

export const deleteOrder = async (orderId) => {
  const order = await Order.findOneAndUpdate(
    { _id: orderId, dateCancelled: null },
    { dateCancelled: Date.now() },
    { upsert: false, useFindAndModify: false, new: true },
  );
  return Promise.resolve(order);
};

export const findOrder = async (orderId) => {
  const order = await Order.findOne({
    _id: orderId,
    dateCancelled: null,
  });
  return Promise.resolve(order);
};
