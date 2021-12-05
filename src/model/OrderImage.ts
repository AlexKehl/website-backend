import { Schema, model } from 'mongoose';
import { Document } from 'mongoose';
import Stripe from 'stripe';

export interface OrderImageDoc {
  id: string;
  itemIds: string[];
  stripeEvents: Stripe.Event[];
}

const OrderImageSchemaDefinition: Record<keyof OrderImageDoc, any> = {
  id: { type: String, required: true },
  itemIds: { type: [String], required: true },
  stripeEvents: { type: [Object] },
};

const OrderImageSchema = new Schema(OrderImageSchemaDefinition);

export const OrderImage = model<OrderImageDoc & Document>(
  'OrderImage',
  OrderImageSchema
);
