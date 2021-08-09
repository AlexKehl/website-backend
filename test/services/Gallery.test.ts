import { imageForConsumerMap } from '../../src/services/Gallery';
import { galleryImageDocs, imagesForGallery } from '../fixtures/GalleryImages';

describe('imageForConsumerMap', () => {
  it('returns imageForConsumer in right format', () => {
    const res = imageForConsumerMap(galleryImageDocs);

    expect(res).toEqual(imagesForGallery);
  });

  it('returns an empty array if input is empty array', () => {
    const res = imageForConsumerMap([]);

    expect(res).toEqual([]);
  });
});
