import { Schema, model, SchemaTypes } from 'mongoose';
import { Document } from 'mongoose';

export enum OrderStatus {
  ACCEPTED,
  NEED_MORE_INFO,
  REJECTED,
}

export enum OrderLevel {
  VERY_LOW,
  LOW,
  MEDIUM,
  HIGH,
  VERY_HIGH,
}

export interface OrderImage {
  id: string;
  url: string;
  name: string;
  description: string;
}

export interface OrderDoc {
  images: OrderImage[];
  status: OrderStatus;
  statusReason?: string;
  priceSum: number;
  level: OrderLevel;
}

const OrderSchema = new Schema({
  images: { type: SchemaTypes.Mixed, required: true },
  status: { type: Number, required: true },
  statusReason: { type: String },
  priceSum: { type: Number, required: true },
  level: { type: Number, required: true },
});

export const Order = model<OrderDoc & Document>('Order', OrderSchema);
