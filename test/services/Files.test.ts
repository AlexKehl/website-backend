import { FileDoc } from '../../src/model/File';
import {
  createFilesToSyncObj,
  isFileValid,
  imageForConsumerMap,
  serializeFileObjects,
} from '../../src/services/Files';
import {
  FileDto,
  FilesToSync,
  SerializedFileObj,
  WithBody,
} from '../../src/types';
import {
  fileDoc,
  fileDocs,
  imagesForConsumer,
  serializedFileObj,
} from '../fixtures/File';

describe('serializeFileObjects', () => {
  it('returns SerializedFileObj[]', () => {
    const { category, ...serializedFileObjRest } = serializedFileObj;
    const input: Partial<WithBody<FileDto>> = {
      files: [serializedFileObjRest] as Express.Multer.File[],
      body: { category: 'acryl' },
    };

    const res = serializeFileObjects(input as WithBody<FileDto>);

    const expected: SerializedFileObj[] = [serializedFileObj];

    expect(res).toEqual(expected);
  });
});

describe('createFilesToSyncObj', () => {
  it('adds toDelete if serializeFileObjects is empty', async () => {
    const res = await createFilesToSyncObj([fileDoc])([]);

    const expected: FilesToSync = {
      toDelete: [fileDoc],
      toUpload: [],
    };

    expect(res).toEqual(expected);
  });

  it('adds toDelete if fileDocs.length > serializeFileObjects.length', async () => {
    const res = await createFilesToSyncObj([fileDoc, ...fileDocs])([
      serializedFileObj,
    ]);

    const expected: FilesToSync = {
      toDelete: fileDocs,
      toUpload: [],
    };

    expect(res).toEqual(expected);
  });

  it('can delete and upload simultaneously', async () => {
    const res = await createFilesToSyncObj([fileDocs[0]])([serializedFileObj]);

    const expected: FilesToSync = {
      toDelete: [fileDocs[0]],
      toUpload: [serializedFileObj],
    };

    expect(res).toEqual(expected);
  });

  it('adds toUpload if fileDocs is empty', async () => {
    const res = await createFilesToSyncObj([])([serializedFileObj]);

    const expected: FilesToSync = {
      toDelete: [],
      toUpload: [serializedFileObj],
    };

    expect(res).toEqual(expected);
  });

  it('returns empty output for empty input', async () => {
    const res = await createFilesToSyncObj([])([]);

    const expected: FilesToSync = {
      toDelete: [],
      toUpload: [],
    };

    expect(res).toEqual(expected);
  });
});

describe('isFileValid', () => {
  it('returns true if input has file', async () => {
    const res = isFileValid(serializedFileObj);

    expect(res).toBe(true);
  });

  it('returns false if input misses some key from SerializedFileObj', async () => {
    const { buffer, ...rest } = serializedFileObj;

    expect(isFileValid(rest as SerializedFileObj)).toBe(false);
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
