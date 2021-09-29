import Stripe from 'stripe';
import HttpStatus from '../../common/constants/HttpStatus';
import { BuyImageDto } from '../../common/interface/Dto';
import { CLIENT_URL } from '../../config';
import { GalleryImage, GalleryImageDoc } from '../model/GalleryImage';
import { tryToExecute } from '../utils/HttpErrors';
import { makeHttpResponse } from '../utils/HttpResponses';

const stripe = new Stripe(
  'sk_test_51JbOrxGTcbQZD9rEMtxJ6UTeyOvRyvlppVCkbG6fwIjDibIGaG0l88q4kTbgagvpJBW0q98UG4t8xJC3xXHQpEaw00CS5cxLO1',
  { apiVersion: '2020-08-27' }
);

const createStripeSession = async ({ price, id }: BuyImageDto) => {
  const imageDoc = await tryToExecute<GalleryImageDoc>({
    fnToTry: async () => GalleryImage.findOne({ id }),
    httpErrorData: {
      statusCode: HttpStatus.NOT_FOUND,
      data: { error: 'GalleryImage is not existing.' },
    },
  });

  const product = await stripe.products.create({
    name: imageDoc.name,
  });

  const priceObj = await stripe.prices.create({
    product: product.id,
    unit_amount: price * 100,
    currency: 'eur',
  });

  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: priceObj.id, quantity: 1 }],
    payment_method_types: ['card', 'giropay', 'sofort'],
    mode: 'payment',
    success_url: `${CLIENT_URL}/gallery/acryl/`,
    cancel_url: `${CLIENT_URL}/checkout/?canceled=true`,
  });

  return makeHttpResponse({
    statusCode: HttpStatus.OK,
    data: {
      redirect: session.url,
    },
  });
};

export { createStripeSession };
