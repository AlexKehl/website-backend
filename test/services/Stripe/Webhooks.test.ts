import { GalleryImage } from '../../../src/model/GalleryImage';
import { OrderImage } from '../../../src/model/OrderImage';
import { sendSuccessfullPaymentEmail } from '../../../src/services/Email';
import { matchEventType } from '../../../src/services/Stripe/Webhooks';
import { sendMessage } from '../../../src/services/Telegram';
import { galleryImageDoc } from '../../fixtures/GalleryImages';
import { OrderImageMock } from '../../fixtures/OrderImages';
import { checkoutSessionCompleted } from '../../fixtures/StripeEvents';
import { getUniqPort, setupServer } from '../../TestSetupUtils';

setupServer({ port: getUniqPort() });

describe('matchEventType', () => {
  it('updates according db data and sends notifications', async () => {
    await OrderImage.create(OrderImageMock);
    await GalleryImage.create(galleryImageDoc);

    await matchEventType(checkoutSessionCompleted);

    const OrderImageDoc = await OrderImage.findOne({ id: OrderImageMock.id });
    const GalleryImageDoc = await GalleryImage.findOne({
      id: galleryImageDoc.id,
    });

    expect(OrderImageDoc?.stripeEvents[0]).toEqual(checkoutSessionCompleted);
    expect(GalleryImageDoc?.isForSell).toBe(false);
    expect(sendSuccessfullPaymentEmail).toHaveBeenCalledTimes(1);
    expect(sendMessage).toHaveBeenCalledTimes(1);
  });
});
