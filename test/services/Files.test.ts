import { serializeFileObj } from '../../src/services/Files';
import { FileDto, SerializedFileObj, WithBody } from '../../src/types';
import { serializedFileObj } from '../fixtures/File';

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
