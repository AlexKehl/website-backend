import { Schema, model } from 'mongoose';
import { Document } from 'mongoose';
import Stripe from 'stripe';
import HttpStatus from '../../common/constants/HttpStatus';
import HttpTexts from '../../common/constants/HttpTexts';
import { User } from '../../common/interface/ConsumerResponses';
import WithPayloadError from '../utils/Exceptions/WithPayloadError';

export interface OrderImageDoc {
  email: string;
  session: Stripe.Checkout.Session;
  itemIds: string[];
  stripeEvents: Stripe.Event[];
  contact: User['contact'];
  address: User['address'];
}

const OrderImageSchemaDefinition: Record<keyof OrderImageDoc, any> = {
  email: { type: String, required: true },
  itemIds: { type: [String], required: true },
  stripeEvents: { type: [Object] },
  contact: { type: Object },
  address: { type: Object },
  session: { type: Object, required: true },
};

const OrderImageSchema = new Schema(OrderImageSchemaDefinition);

export const OrderImage = model<OrderImageDoc & Document>(
  'OrderImage',
  OrderImageSchema
);

export const findOrderImageForPaymentIntent = async (
  event: Stripe.Event
): Promise<OrderImageDoc> => {
  const order = await OrderImage.findOne({
    'session.payment_intent': (event.data.object as any).id,
  }).lean();
  if (!order) {
    throw new WithPayloadError({
      statusCode: HttpStatus.NOT_FOUND,
      data: { error: HttpTexts.orderIsMissing },
    });
  }

  return order;
};

export const updateOrderImageForPaymentIntent = async (
  event: Stripe.Event,
  data: Partial<OrderImageDoc>
) => {
  const updateRes = await OrderImage.updateOne(
    {
      'session.payment_intent': (event.data.object as any).id,
    },
    data
  );
  if (updateRes.matchedCount === 0) {
    throw new WithPayloadError({
      statusCode: HttpStatus.NOT_FOUND,
      data: { error: HttpTexts.orderIsMissing },
    });
  }

  return updateRes;
};
