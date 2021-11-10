import { Express } from 'express';
import Stripe from 'stripe';
import { Endpoints } from '../../common/constants/Endpoints';
import { STRIPE_API_KEY, STRIPE_SECRET } from '../../config';
import { checkoutController } from '../controllers/Payments';
import routeHandler from '../utils/RouteHandler';

const stripe = new Stripe(STRIPE_API_KEY, { apiVersion: '2020-08-27' });

export const startPaymentRoutes = (app: Express) => {
  app.post(
    Endpoints.checkout,
    routeHandler({ controller: checkoutController })
  );

  app.post('/webhook', (request, response) => {
    // const event = request.body as Stripe.Event;
    //
    // console.log(event.type);

    const sig = request.headers['stripe-signature'] as string;

    console.log(sig);

    const payload = request.body;
    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig, STRIPE_SECRET);
    } catch (err: any) {
      console.log(err.message);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(event);

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('paymentIntent', paymentIntent);
        console.log('PaymentIntent was successful!');
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        console.log('PaymentMethod was attached to a Customer!');
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.json({ received: true });
  });
};
