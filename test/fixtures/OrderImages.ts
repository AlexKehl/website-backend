import faker from 'faker';
import { OrderImageDoc } from '../../src/model/OrderImage';
import { galleryImageDoc } from './GalleryImages';
import { checkoutSessionCompleted } from './StripeEvents';

export const OrderImageMock: OrderImageDoc = {
  id: (checkoutSessionCompleted.data.object as any).id,
  itemIds: [galleryImageDoc.id, faker.datatype.uuid()],
  stripeEvents: [],
};
