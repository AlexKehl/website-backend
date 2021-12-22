import { Schema, model } from 'mongoose';
import { Document } from 'mongoose';
import Stripe from 'stripe';
import HttpStatus from '../../common/constants/HttpStatus';
import HttpTexts from '../../common/constants/HttpTexts';
import WithPayloadError from '../utils/Exceptions/WithPayloadError';

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

export const findOrderImage = async (id: string) => {
  const order = await OrderImage.findOne({ id }).lean();
  if (!order) {
    throw new WithPayloadError({
      statusCode: HttpStatus.NOT_FOUND,
      data: { error: HttpTexts.orderIsMissing },
    });
  }

  return order;
};
