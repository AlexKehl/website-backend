import Stripe from 'stripe';
import HttpStatus from '../../../common/constants/HttpStatus';
import { STRIPE_API_KEY, STRIPE_SECRET } from '../../../config';
import { HttpResponse } from '../../types';
import WithPayloadError from '../../utils/Exceptions/WithPayloadError';
import { handleHttpErrors, makeHttpError } from '../../utils/HttpErrors';
import { makeHttpResponse } from '../../utils/HttpResponses';
import { logger } from '../../utils/Logger';

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

const handleSuccessfullPayment = async (event: Stripe.Event) => {
  // 1. Mark as payed in db
  // 2. Send email to payer
  // 3. Notify in telegram
  console.log('PAYMENT RECEIVED');
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

const matchEventType = (event: Stripe.Event) => {
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
