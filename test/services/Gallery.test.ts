import {
  createFilesToSyncObj,
  imageForConsumerMap,
  serializeFileObjects,
} from '../../src/services/Gallery';
import { GalleryImagesToSync, SerializedGalleryObj } from '../../src/types';
import {
  fileDoc,
  fileDocs,
  imagesForConsumer,
  serializedFileObj,
} from '../fixtures/GalleryImages';

describe('serializeFileObjects', () => {
  it('returns SerializedFileObj[]', () => {
    const { category, ...serializedFileObjRest } = serializedFileObj;
    const input = {
      files: [serializedFileObjRest],
      body: {
        category: 'acryl',
        isForSell: true,
        description: { en: 'This is a description' },
      },
    };

    const res = serializeFileObjects(input as any);

    const expected: SerializedGalleryObj[] = [serializedFileObj];

    expect(res).toEqual(expected);
  });
});

describe('createFilesToSyncObj', () => {
  it('adds toDelete if serializeFileObjects is empty', async () => {
    const res = await createFilesToSyncObj([fileDoc])([]);

    const expected: GalleryImagesToSync = {
      toDelete: [fileDoc],
      toUpload: [],
    };

    expect(res).toEqual(expected);
  });

  it('adds toDelete if fileDocs.length > serializeFileObjects.length', async () => {
    const res = await createFilesToSyncObj([fileDoc, ...fileDocs])([
      serializedFileObj,
    ]);

    const expected: GalleryImagesToSync = {
      toDelete: fileDocs,
      toUpload: [],
    };

    expect(res).toEqual(expected);
  });

  it('can delete and upload simultaneously', async () => {
    const res = await createFilesToSyncObj([fileDocs[0]])([serializedFileObj]);

    const expected: GalleryImagesToSync = {
      toDelete: [fileDocs[0]],
      toUpload: [serializedFileObj],
    };

    expect(res).toEqual(expected);
  });

  it('adds toUpload if fileDocs is empty', async () => {
    const res = await createFilesToSyncObj([])([serializedFileObj]);

    const expected: GalleryImagesToSync = {
      toDelete: [],
      toUpload: [serializedFileObj],
    };

    expect(res).toEqual(expected);
  });

  it('returns empty output for empty input', async () => {
    const res = await createFilesToSyncObj([])([]);

    const expected: GalleryImagesToSync = {
      toDelete: [],
      toUpload: [],
    };

    expect(res).toEqual(expected);
  });
});

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
