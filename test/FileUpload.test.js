const {
  moveFile,
  getFileFromNestedObj,
  saveFileToPath,
  storeFileMetaInDb,
} = require('src/FileUpload');

const FileModel = require('src/model/File.js');

jest.mock('src/model/File.js');

describe('moveFile', () => {
  it('calls file.mv with given path', async () => {
    const path = './foo';
    const file = {
      mv: jest.fn(async () => true),
    };

    await moveFile(path)(file);
    expect(file.mv).toHaveBeenCalledWith(path);
    expect(file.mv).toHaveBeenCalledTimes(1);
  });
});

describe('getFileFromNestedObj', () => {
  it('gets the proper file obj', () => {
    const neededObj = { foo: 'bar' };
    const inputFileObj = {
      image: neededObj,
    };

    const res = getFileFromNestedObj(inputFileObj);

    expect(res).toEqual(neededObj);
  });

  it('throws an error if there is no nestedObj', () => {
    const input = {};

    expect(() => {
      getFileFromNestedObj(input);
    }).toThrow();
  });
});

describe('saveFileToPath', () => {
  it('extracts file and saves it on given path', async () => {
    const path = './foo';
    const file = {
      mv: jest.fn(async () => true),
    };
    const inputFileObj = {
      image: file,
    };

    await saveFileToPath(path)(inputFileObj);
    expect(file.mv).toHaveBeenCalledWith(path);
    expect(file.mv).toHaveBeenCalledTimes(1);
  });
});

describe('storeFileMetaInDb', () => {
  it('calls .create on file schema', async () => {
    FileModel.create.mockResolvedValue();
    const input = {
      path: './foo',
      fileMeta: {
        name: 'i-201.jpg',
        category: 'Acryl',
      },
    };

    await storeFileMetaInDb(input);

    const expected = {
      path: input.path,
      ...input.fileMeta,
    };
    expect(FileModel.create).toHaveBeenCalledTimes(1);
    expect(FileModel.create).toHaveBeenCalledWith(expected);
  });

  it('throws an error if path is missing', async () => {
    const input = {
      fileMeta: {
        name: 'i-201.jpg',
        category: 'Acryl',
      },
    };

    await expect(storeFileMetaInDb(input)).rejects.toEqual(expect.any(Error));
  });

  it('throws an error if meta is missing', async () => {
    const input = {
      path: './foo',
    };

    await expect(storeFileMetaInDb(input)).rejects.toEqual(expect.any(Error));
  });
});
