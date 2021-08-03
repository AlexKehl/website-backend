import { Schema, model } from 'mongoose';
import { Document } from 'mongoose';
import { FileDoc } from '../types/Files';

export interface OrderImageDoc extends FileDoc {}

const OrderImageSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
});

export const File = model<OrderImageDoc & Document>(
  'OrderImage',
  OrderImageSchema
);
