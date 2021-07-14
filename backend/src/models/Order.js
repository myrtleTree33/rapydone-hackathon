import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const { Schema, model } = mongoose;

const OrderSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  productId: {
    type: String,
    required: true,
  },
  buyerId: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  datePurchased: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateCancelled: {
    type: Date,
  },
});

export default model('Order', OrderSchema);
