import { createFilesToSyncObj } from '../../src/services/Files';
import { GalleryImagesToSync } from '../../src/types';
import { fileDoc, fileDocs, imageWithMeta } from '../fixtures/GalleryImages';

describe('createFilesToSyncObj', () => {
  const pred = (file: any, obj: any) =>
    file.category === obj.category && file.name === obj.originalname;

  it('adds toDelete if serializeFileObjects is empty', () => {
    const res = createFilesToSyncObj({
      fileDocs: [fileDoc],
      imagesWithMeta: [],
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
      imagesWithMeta: [imageWithMeta],
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
      imagesWithMeta: [imageWithMeta],
      pred,
    });

    const expected: GalleryImagesToSync = {
      toDelete: [fileDocs[0]],
      toUpload: [imageWithMeta],
    };

    expect(res).toEqual(expected);
  });

  it('adds toUpload if fileDocs is empty', async () => {
    const res = createFilesToSyncObj({
      fileDocs: [],
      imagesWithMeta: [imageWithMeta],
      pred,
    });

    const expected: GalleryImagesToSync = {
      toDelete: [],
      toUpload: [imageWithMeta],
    };

    expect(res).toEqual(expected);
  });

  it('returns empty output for empty input', async () => {
    const res = createFilesToSyncObj({
      fileDocs: [],
      imagesWithMeta: [],
      pred,
    });

    const expected: GalleryImagesToSync = {
      toDelete: [],
      toUpload: [],
    };

    expect(res).toEqual(expected);
  });
});
