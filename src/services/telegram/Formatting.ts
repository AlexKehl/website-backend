import { BASE_URL } from '../../../config';
import { GalleryImageDoc } from '../../model/GalleryImage';
import { OrderImageDoc } from '../../model/OrderImage';
import { generateImagePathHttpResponse } from '../Gallery';

export const formatImageBuyedMessage = (
  order: OrderImageDoc,
  image: GalleryImageDoc
): string => {
  return JSON.stringify(
    {
      name: image.name,
      path: `${BASE_URL}/${
        generateImagePathHttpResponse(image.category, image.id).data.imagePath
      }`,
      contact: order.contact,
      address: order.address,
    },
    null,
    2
  );
};
