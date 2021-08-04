import { imageForConsumerMap } from '../../src/services/Gallery';
import { fileDocs, imagesForConsumer } from '../fixtures/GalleryImages';

describe('imageForConsumerMap', () => {
  it('returns imageForConsumer in right format', () => {
    const res = imageForConsumerMap(fileDocs);

    expect(res).toEqual(imagesForConsumer);
  });

  it('returns an empty array if input is empty array', () => {
    const res = imageForConsumerMap([]);

    expect(res).toEqual([]);
  });
});
