import { contactDto, addressDto } from '../../../common/fixtures/Dto';
import { galleryImageDoc } from '../../fixtures/GalleryImages';
import { OrderImageMock } from '../../fixtures/OrderImages';
import { formatImageBuyedMessage } from '../../../src/services/telegram/Formatting';
import { BASE_URL } from '../../../config';

describe('formatImageBuyedMessage', () => {
  it('formats image buyed message for telegram', () => {
    const res = formatImageBuyedMessage(OrderImageMock, galleryImageDoc);

    const expected = JSON.stringify(
      {
        name: galleryImageDoc.name,
        path: `${BASE_URL}/acryl/id123`,
        contact: contactDto,
        address: addressDto,
      },
      null,
      2
    );

    expect(res).toEqual(expected);
  });
});
