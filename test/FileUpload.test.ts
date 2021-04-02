import { getFileFromNestedObj, performFileUpload } from 'src/FileUpload';
import { setupModelTest } from 'test/utils';

import FileModel from 'src/model/File.js';

setupModelTest(FileModel, 'file');

describe('getFileFromNestedObj', () => {
  it('gets the proper file obj', () => {
    const neededObj = { foo: 'bar' };
    const inputFileObj = {
      image: neededObj,
    };

    const res = getFileFromNestedObj(inputFileObj);

    expect(res).toEqual(neededObj);
  });
});

describe('performFileUpload', () => {
  it('moves file to path and uploads its meta to db', async () => {
    const fileInput = {
      path: './foo',
      name: 'i-201.jpg',
      category: 'Acryl',
      height: 1024,
      width: 768,
    };
    await FileModel.create(fileInput);

    const file = {
      mv: jest.fn(async () => true),
    };
    const input = {
      body: {
        path: fileInput.path,
        fileMeta: {
          name: fileInput.name,
          category: fileInput.category,
          height: fileInput.height,
          width: fileInput.width,
        },
      },
      file: {
        image: file,
      },
    };

    await performFileUpload(input);

    const res = await FileModel.findOne({ name: 'i-201.jpg' });

    expect(res).toMatchObject(fileInput);

    expect(file.mv).toHaveBeenCalledTimes(1);
    expect(file.mv).toHaveBeenCalledWith('./pictures/Acryl/i-201.jpg');
  });
});
