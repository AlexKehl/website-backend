import { Schema, model } from 'mongoose';
import { Document } from 'mongoose';

export enum OrderStatus {
  ACCEPTED,
  NEED_MORE_INFO,
  REJECTED,
  WAITING_FOR_APPROVAL,
}

export enum OrderLevel {
  VERY_LOW,
  LOW,
  MEDIUM,
  HIGH,
  VERY_HIGH,
}

export interface OrderDoc {
  imageIds: string[];
  status: OrderStatus;
  statusReason?: string;
  price: number;
  level: OrderLevel;
}

const OrderSchema = new Schema({
  imageIds: { type: [String], required: true },
  status: { type: Number, required: true },
  statusReason: { type: String },
  priceSum: { type: Number, required: true },
  level: { type: Number, required: true },
});

export const Order = model<OrderDoc & Document>('Order', OrderSchema);
