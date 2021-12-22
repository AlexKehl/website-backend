import Stripe from 'stripe';
import HttpStatus from '../../../common/constants/HttpStatus';
import { withParallel } from '../../../common/utils/Functions';
import { STRIPE_API_KEY, STRIPE_SECRET } from '../../../config';
import { GalleryImage } from '../../model/GalleryImage';
import { findOrderImage, OrderImage } from '../../model/OrderImage';
import WithPayloadError from '../../utils/Exceptions/WithPayloadError';
import { handleHttpErrors } from '../../utils/HttpErrors';
import { makeHttpResponse } from '../../utils/HttpResponses';
import { sendSuccessfullPaymentEmail } from '../Email';
import { sendMessage } from '../Telegram';

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
  const order = await findOrderImage((event.data.object as any).id);
  await OrderImage.updateOne(
    { id: (event.data.object as any).id },
    { stripeEvents: [...order.stripeEvents, event] }
  );
  const images = await GalleryImage.find({ id: { $in: order.itemIds } });
  return withParallel({ threads: images.length })(async (image) =>
    GalleryImage.updateOne({ id: image.id }, { isForSell: false })
  )(images);
};

const handleSuccessfullPayment = async (event: Stripe.Event) => {
  await markItemsAsPayed(event);
  await sendSuccessfullPaymentEmail(
    (event.data.object as any).customer_details.email
  );
  sendMessage('New item buyed!');
  return makeHttpResponse({
    statusCode: HttpStatus.OK,
    data: { received: true },
  });
};

const handleFailedPayment = async (event: Stripe.Event) => {
  console.log('PAYMENT FAILED');
  return makeHttpResponse({
    statusCode: HttpStatus.OK,
    data: { received: true },
  });
};

const handleUnknownEventType = async (event: Stripe.Event) => {
  // logger.log({ level: 'error', message: JSON.stringify(event, null, 2) });
  return Promise.reject(
    new WithPayloadError({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      data: {
        error: `Unknown event type: ${event.type}`,
      },
    })
  );
};

export const matchEventType = (event: Stripe.Event) => {
  // console.log(event.type, JSON.stringify(event, null, 2));
  switch (event.type) {
    case 'checkout.session.completed':
      return handleSuccessfullPayment(event);
    case 'payment_intent.payment_failed':
      return handleFailedPayment(event);
    default:
      return handleUnknownEventType(event);
  }
};

export const handleWebHook = (headers: any, body: any) =>
  verifyStripeSecret(headers['stripe-signature'], body)
    .then(matchEventType)
    .catch(handleHttpErrors);
