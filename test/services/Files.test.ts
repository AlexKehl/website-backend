import {
  createFilesToSyncObj,
  serializeFileObjects,
} from '../../src/services/Files';
import { GalleryImagesToSync, SerializedGalleryObj } from '../../src/types';
import {
  fileDoc,
  fileDocs,
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
  const pred = (file: any, obj: any) =>
    file.category === obj.category && file.name === obj.originalname;

  it('adds toDelete if serializeFileObjects is empty', () => {
    const res = createFilesToSyncObj({
      fileDocs: [fileDoc],
      serializedFileObjects: [],
      pred,
    });

    const expected: GalleryImagesToSync = {
      toDelete: [fileDoc],
      toUpload: [],
    };

    expect(res).toEqual(expected);
  });

  it('adds toDelete if fileDocs.length > serializeFileObjects.length', async () => {
    const res = createFilesToSyncObj({
      fileDocs: [fileDoc, ...fileDocs],
      serializedFileObjects: [serializedFileObj],
      pred,
    });

    const expected: GalleryImagesToSync = {
      toDelete: fileDocs,
      toUpload: [],
    };

    expect(res).toEqual(expected);
  });

  it('can delete and upload simultaneously', () => {
    const res = createFilesToSyncObj({
      fileDocs: [fileDocs[0]],
      serializedFileObjects: [serializedFileObj],
      pred,
    });

    const expected: GalleryImagesToSync = {
      toDelete: [fileDocs[0]],
      toUpload: [serializedFileObj],
    };

    expect(res).toEqual(expected);
  });

  it('adds toUpload if fileDocs is empty', async () => {
    const res = createFilesToSyncObj({
      fileDocs: [],
      serializedFileObjects: [serializedFileObj],
      pred,
    });

    const expected: GalleryImagesToSync = {
      toDelete: [],
      toUpload: [serializedFileObj],
    };

    expect(res).toEqual(expected);
  });

  it('returns empty output for empty input', async () => {
    const res = createFilesToSyncObj({
      fileDocs: [],
      serializedFileObjects: [],
      pred,
    });

    const expected: GalleryImagesToSync = {
      toDelete: [],
      toUpload: [],
    };

    expect(res).toEqual(expected);
  });
});
