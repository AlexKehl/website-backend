import { OrderImageDoc } from '../../src/model/OrderImage';
import { galleryImageDoc } from './GalleryImages';
import { session } from './StripeEvents';
import { v4 as uuid } from 'uuid';
import { addressDto, contactDto } from '../../common/fixtures/Dto';
import { RegisteredUser } from './User';

export const OrderImageMock: OrderImageDoc = {
  email: RegisteredUser.email,
  session,
  itemIds: [galleryImageDoc.id, uuid()],
  stripeEvents: [],
  contact: contactDto,
  address: addressDto,
};
