const R = require('ramda');
const { pipeP, depsCheck } = require('src/utils/Functions');
const FileModel = require('src/model/File.js');

const moveFile = path => async file => {
  await file.mv(path);
};

const getFileFromNestedObj = nestedObj => {
  const objectValues = Object.values(nestedObj);
  if (R.isEmpty(objectValues)) {
    throw Error('No file provided');
  }
  return objectValues[0];
};

const saveFileToPath = path =>
  pipeP(
    getFileFromNestedObj,
    moveFile(path)
  );

const storeFileMetaInDb = async ({ path, fileMeta }) => {
  depsCheck('storeFileMetaInDb')(['path', 'fileMeta'])({ path, fileMeta });
  await FileModel.create({ path, ...fileMeta });
};

module.exports = {
  moveFile,
  getFileFromNestedObj,
  saveFileToPath,
  storeFileMetaInDb,
};
