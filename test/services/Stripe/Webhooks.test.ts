import { GalleryImage } from '../../../src/model/GalleryImage';
import { OrderImage } from '../../../src/model/OrderImage';
import { User } from '../../../src/model/User';
import { sendSuccessfullPaymentEmail } from '../../../src/services/Email';
import { matchEventType } from '../../../src/services/Stripe/Webhooks';
import { sendImageBuyedMessage } from '../../../src/services/telegram';
import { galleryImageDoc } from '../../fixtures/GalleryImages';
import { OrderImageMock } from '../../fixtures/OrderImages';
import {
  paymentIntentCanceled,
  paymentIntentSucceeded,
  session,
} from '../../fixtures/StripeEvents';
import { RegisteredUser } from '../../fixtures/User';
import { getUniqPort, setupServer } from '../../TestSetupUtils';

jest.mock('../../../src/services/Email');

setupServer({ port: getUniqPort() });

describe('matchEventType', () => {
  it('updates according db data and sends notifications', async () => {
    await Promise.all([
      OrderImage.create(OrderImageMock),
      GalleryImage.create(galleryImageDoc),
      User.create(RegisteredUser),
    ]);

    await matchEventType(paymentIntentSucceeded);

    const OrderImageDoc = await OrderImage.findOne({
      'session.id': session.id,
    });
    const GalleryImageDoc = await GalleryImage.findOne({
      id: galleryImageDoc.id,
    });

    expect(OrderImageDoc?.stripeEvents[0]).toEqual(paymentIntentSucceeded);
    expect(OrderImageDoc?.contact).toEqual(RegisteredUser.contact);
    expect(OrderImageDoc?.address).toEqual(RegisteredUser.address);
    expect(GalleryImageDoc?.isForSell).toBe(false);
    expect(sendSuccessfullPaymentEmail).toHaveBeenCalledTimes(1);
    expect(sendImageBuyedMessage).toHaveBeenCalledTimes(1);
  });

  it('deletes cancelled session', async () => {
    await OrderImage.create(OrderImageMock);

    await matchEventType(paymentIntentCanceled);

    const OrderImageDocAfterCancel = await OrderImage.findOne({
      'session.id': OrderImageMock.session.id,
    });
    expect(OrderImageDocAfterCancel).toBe(null);
  });
});
