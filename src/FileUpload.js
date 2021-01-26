const R = require('ramda');
const { depsCheck } = require('src/utils/Functions');
const FileModel = require('src/model/File.js');

const getFilePath = ({ category }) => file =>
  `${process.env.FILE_PATH}/${category}/${file.name}`;

const moveFile = fileMeta => async file => {
  await file.mv(getFilePath(fileMeta)(file));
};

const getFileFromNestedObj = nestedObj => {
  const objectValues = Object.values(nestedObj);
  if (R.isEmpty(objectValues)) {
    throw Error('No file provided');
  }
  return objectValues[0];
};

const storeFileMetaInDb = async ({ fileMeta, path }) => {
  depsCheck('storeFileMetaInDb')(['fileMeta', 'path'])({ fileMeta, path });
  await FileModel.create({ path, ...fileMeta });
};

const performFileUpload = async ({ fileMeta, file }) => {
  try {
    depsCheck('performFileUpload')(['category', 'height', 'width'])(fileMeta);
  } catch (e) {
    return Promise.reject(
      new Error('Please specify category, height and width of the image')
    );
  }

  try {
    depsCheck('performFileUpload')(['mv'])(file);
  } catch (e) {
    return Promise.reject(new Error('Error with the uploaded image'));
  }

  return Promise.all([
    storeFileMetaInDb({ path: getFilePath(fileMeta)(file), fileMeta }),
    moveFile(fileMeta)(getFileFromNestedObj(file)),
  ]);
};

module.exports = {
  performFileUpload,
  moveFile,
  getFileFromNestedObj,
  storeFileMetaInDb,
};
