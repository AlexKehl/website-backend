import {
  hasFile,
  imageForConsumerMap,
  serializeFileObj,
} from '../../src/services/Files';
import { FileDto, SerializedFileObj, WithBody } from '../../src/types';
import { makeHttpError } from '../../src/utils/HttpErrors';
import HttpStatus from '../../src/utils/HttpStatus';
import {
  fileDocs,
  imagesForConsumer,
  serializedFileObj,
} from '../fixtures/File';

describe('serializeFileObj', () => {
  it('returns an obj of type SerializedFileObj', () => {
    const { category, ...serializedFileObjRest } = serializedFileObj;
    const input: Partial<WithBody<FileDto>> = {
      file: serializedFileObjRest as Express.Multer.File,
      body: { category: 'Acryl' },
    };

    const res = serializeFileObj(input as WithBody<FileDto>);

    const expected: SerializedFileObj = serializedFileObj;

    expect(res).toEqual(expected);
  });
});

describe('hasFile', () => {
  it('resolves with SerializedFileObj if input has file', async () => {
    const res = await hasFile(serializedFileObj);

    expect(res).toEqual(serializedFileObj);
  });

  it('rejects if input misses some key from SerializedFileObj', async () => {
    const { buffer, ...rest } = serializedFileObj;

    const expected = makeHttpError({
      statusCode: HttpStatus.BAD_REQUEST,
      data: { error: 'Corrupt File' },
    });

    await expect(hasFile(rest as SerializedFileObj)).rejects.toEqual(expected);
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
