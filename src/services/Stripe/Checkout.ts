import Stripe from 'stripe';
import * as R from 'remeda';
import HttpStatus from '../../../common/constants/HttpStatus';
import { BuyImageDto } from '../../../common/interface/Dto';
import { withParallel } from '../../../common/utils/Functions';
import { STRIPE_API_KEY, CLIENT_URL } from '../../../config';
import { GalleryImageDoc, GalleryImage } from '../../model/GalleryImage';
import { handleHttpErrors, tryToExecute } from '../../utils/HttpErrors';
import { makeHttpResponse } from '../../utils/HttpResponses';
import { OrderImage } from '../../model/OrderImage';
import WithPayloadError from '../../utils/Exceptions/WithPayloadError';

const stripe = new Stripe(STRIPE_API_KEY, { apiVersion: '2020-08-27' });

const saveSessionInDb = (
  dto: BuyImageDto,
  session: Stripe.Response<Stripe.Checkout.Session>
) => {
  return OrderImage.create({ id: session.id, itemIds: dto.ids });
};

const getImageDocs = (dto: BuyImageDto) => {
  return tryToExecute<GalleryImageDoc[]>({
    fnToTry: async () => GalleryImage.find({ id: { $in: dto.ids } }),
    httpErrorData: {
      statusCode: HttpStatus.NOT_FOUND,
      data: { error: 'GalleryImage is not existing.' },
    },
  });
};

const createStripeProducts = (imageDocs: GalleryImageDoc[]) =>
  withParallel({ threads: imageDocs.length })((imageDoc) => {
    return stripe.products.create({
      name: imageDoc.name,
    });
  })(imageDocs);

const createStripePriceObjects = (
  products: Stripe.Response<Stripe.Product>[],
  imageDocs: GalleryImageDoc[]
) =>
  withParallel({ threads: imageDocs.length })(([imageDoc, product]) => {
    return stripe.prices.create({
      product: product.id,
      unit_amount: imageDoc.price! * 100,
      currency: 'eur',
    });
  })(R.zip(imageDocs, products));

const createStripeSessionObject = async (
  priceObjects: Stripe.Response<Stripe.Price>[]
) =>
  stripe.checkout.sessions.create({
    line_items: priceObjects.map((priceObj) => ({
      price: priceObj.id,
      quantity: 1,
    })),
    payment_method_types: ['card', 'giropay', 'sofort'],
    mode: 'payment',
    success_url: `${CLIENT_URL}/gallery/acryl/`,
    cancel_url: `${CLIENT_URL}/checkout/?canceled=true`,
  });

const handleBadRequest = (imageDocs: GalleryImageDoc[]) => {
  if (imageDocs.some((doc) => !doc.isForSell)) {
    throw new WithPayloadError({
      statusCode: HttpStatus.BAD_REQUEST,
      data: {
        error: 'Some of chosen items are not for sell',
      },
    });
  }
};

const createStripeSession = async (dto: BuyImageDto) => {
  try {
    const imageDocs = await getImageDocs(dto);
    handleBadRequest(imageDocs);
    const products = await createStripeProducts(imageDocs);
    const priceObjects = await createStripePriceObjects(products, imageDocs);
    const session = await createStripeSessionObject(priceObjects);

    await saveSessionInDb(dto, session);

    return makeHttpResponse({
      statusCode: HttpStatus.OK,
      data: {
        redirect: session.url,
      },
    });
  } catch (e) {
    return handleHttpErrors(e);
  }
};

export { createStripeSession };
