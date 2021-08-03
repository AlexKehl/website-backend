import {
  imageForConsumerMap,
  serializeFileObjects,
} from '../../src/services/Gallery';
import { SerializedGalleryObj } from '../../src/types';
import {
  fileDocs,
  imagesForConsumer,
  serializedFileObj,
} from '../fixtures/GalleryImages';

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
