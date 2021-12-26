import Stripe from 'stripe';
import HttpStatus from '../../../common/constants/HttpStatus';
import { withParallel } from '../../../common/utils/Functions';
import { STRIPE_API_KEY, STRIPE_SECRET } from '../../../config';
import { GalleryImage } from '../../model/GalleryImage';
import {
  findOrderImageForPaymentIntent,
  OrderImage,
  updateOrderImageForPaymentIntent,
} from '../../model/OrderImage';
import { findUser } from '../../model/User';
import WithPayloadError from '../../utils/Exceptions/WithPayloadError';
import { handleHttpErrors } from '../../utils/HttpErrors';
import { makeHttpResponse } from '../../utils/HttpResponses';
import { logger } from '../../utils/Logger';
import { sendSuccessfullPaymentEmail } from '../Email';
import { sendImageBuyedMessage } from '../telegram';

const stripe = new Stripe(STRIPE_API_KEY, { apiVersion: '2020-08-27' });

const verifyStripeSecret = (signature: string, body: any) => {
  try {
    return Promise.resolve(
      stripe.webhooks.constructEvent(body, signature, STRIPE_SECRET)
    );
  } catch (err: any) {
    return Promise.reject(
      new WithPayloadError({
        statusCode: HttpStatus.BAD_REQUEST,
        data: {
          error: `Webhook Error: ${err.message}`,
        },
      })
    );
  }
};

const markItemsAsPayed = async (event: Stripe.Event) => {
  const order = await findOrderImageForPaymentIntent(event);
  const user = await findUser(order.email);
  await updateOrderImageForPaymentIntent(event, {
    stripeEvents: [...order.stripeEvents, event],
    address: user.address,
    contact: user.contact,
  });
  const images = await GalleryImage.find({ id: { $in: order.itemIds } });
  return withParallel({ threads: images.length })(async (image) =>
    GalleryImage.updateOne({ id: image.id }, { isForSell: false })
  )(images);
};

const handleSuccessfullPayment = async (event: Stripe.Event) => {
  const order = await findOrderImageForPaymentIntent(event);
  await markItemsAsPayed(event);
  await sendSuccessfullPaymentEmail(order.email);
  await sendImageBuyedMessage(event);
  return makeHttpResponse({
    statusCode: HttpStatus.OK,
    data: { received: true },
  });
};

const handleFailedPayment = async (event: Stripe.Event) => {
  return makeHttpResponse({
    statusCode: HttpStatus.OK,
    data: { received: true },
  });
};

const handleUnknownEventType = async (event: Stripe.Event) => {
  logger.log({ level: 'error', message: JSON.stringify(event, null, 2) });
  return Promise.reject(
    new WithPayloadError({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      data: {
        error: `Unknown event type: ${event.type}`,
      },
    })
  );
};

const handleCancelledPayment = async (event: Stripe.Event) => {
  await OrderImage.deleteOne({
    'session.payment_intent': (event.data.object as any).id,
  });
  return makeHttpResponse({
    statusCode: HttpStatus.OK,
    data: { received: true },
  });
};

export const matchEventType = (event: Stripe.Event) => {
  switch (event.type) {
    case 'payment_intent.succeeded':
      return handleSuccessfullPayment(event);
    case 'payment_intent.payment_failed':
      return handleFailedPayment(event);
    case 'payment_intent.canceled':
      return handleCancelledPayment(event);
    default:
      return handleUnknownEventType(event);
  }
};

export const handleWebHook = (headers: any, body: any) =>
  verifyStripeSecret(headers['stripe-signature'], body)
    .then(matchEventType)
    .catch(handleHttpErrors);
