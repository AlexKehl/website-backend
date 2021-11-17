import Stripe from 'stripe';
import HttpStatus from '../../common/constants/HttpStatus';
import { BuyImageDto } from '../../common/interface/Dto';
import { withParallel } from '../../common/utils/Functions';
import { CLIENT_URL, STRIPE_API_KEY } from '../../config';
import { GalleryImage, GalleryImageDoc } from '../model/GalleryImage';
import { tryToExecute } from '../utils/HttpErrors';
import { makeHttpResponse } from '../utils/HttpResponses';
import * as R from 'remeda';

const stripe = new Stripe(STRIPE_API_KEY, { apiVersion: '2020-08-27' });

const createStripeSession = async ({ ids }: BuyImageDto) => {
  const imageDocs = await tryToExecute<GalleryImageDoc[]>({
    fnToTry: async () => GalleryImage.find({ id: { $in: ids } }),
    httpErrorData: {
      statusCode: HttpStatus.NOT_FOUND,
      data: { error: 'GalleryImage is not existing.' },
    },
  });
  console.log(imageDocs);

  const products = await withParallel({ threads: imageDocs.length })(
    (imageDoc) => {
      return stripe.products.create({
        name: imageDoc.name,
      });
    }
  )(imageDocs);

  const priceObjects = await withParallel({ threads: imageDocs.length })(
    ([imageDoc, product]) => {
      return stripe.prices.create({
        product: product.id,
        unit_amount: imageDoc.price! * 100,
        currency: 'eur',
      });
    }
  )(R.zip(imageDocs, products));

  const session = await stripe.checkout.sessions.create({
    line_items: priceObjects.map((priceObj) => ({
      price: priceObj.id,
      quantity: 1,
    })),
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
