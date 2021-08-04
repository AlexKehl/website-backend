import { Schema, model } from 'mongoose';
import { Document } from 'mongoose';
import { FileDoc } from '../types/Files';

export interface OrderImageDoc extends FileDoc {}

const OrderImageSchemaDefinition: Record<keyof OrderImageDoc, any> = {
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
};

const OrderImageSchema = new Schema(OrderImageSchemaDefinition);

export const File = model<OrderImageDoc & Document>(
  'OrderImage',
  OrderImageSchema
);
