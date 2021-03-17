const fileUploadRequest = require('src/validators/schemas/fileUploadRequest');
const [someCategory] = require('src/configuration/Categories');
const Joi = require('joi');

describe('fileUploadRequest', () => {
  it('checks valid input', () => {
    const validValue = {
      image: { mv: () => true },
      fileMeta: {
        name: 'image1',
        category: someCategory,
        height: 1024,
        width: 768,
      },
    };
    const isInvalid = Joi.assert(validValue, fileUploadRequest);

    expect(isInvalid).toEqual(undefined);
  });
});
