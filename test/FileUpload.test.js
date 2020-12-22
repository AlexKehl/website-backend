const { moveFile } = require('src/FileUpload');
const { UploadedFile } = require('express-fileupload');

describe('moveFile', () => {
  it('It calls file.mv with given path', async () => {
    const path = './foo';
    const file = {
      mv: jest.fn(async () => true),
    };

    moveFile(path)(file);
  });
});
