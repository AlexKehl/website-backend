import fileUploadRequest from '../../../src/validators/schemas/fileUploadRequest';
import Categories from '../../../src/configuration/Categories';
import Joi from 'joi';

describe('fileUploadRequest', () => {
  it('checks valid input', () => {
    const validValue = {
      image: { mv: () => true },
      fileMeta: {
        name: 'image1',
        category: Categories[0],
        height: 1024,
        width: 768,
      },
    };
    const isInvalid = Joi.assert(validValue, fileUploadRequest);

    expect(isInvalid).toEqual(undefined);
  });
});
