import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const { Schema, model } = mongoose;

const ProductSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  numRemaining: {
    type: Number,
    reqiured: true,
    default: 0,
  },
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateDeleted: {
    type: Date,
  },
});

export default model('Product', ProductSchema);
