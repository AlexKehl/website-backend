const FileModel = require('src/model/File.js');
const { makeHttpError } = require('src/utils/HttpError');
const { makeHttpResponse } = require('src/utils/HttpResponse');

const getFilePath = ({ category, name }) =>
  `${process.env.FILE_PATH}/${category}/${name}`;

const getFileFromNestedObj = nestedObj => {
  const objectValues = Object.values(nestedObj);
  return objectValues[0];
};

const performFileUpload = async ({ body, file }) => {
  const { fileMeta } = body;
  const { category, name } = fileMeta;
  const rawFile = getFileFromNestedObj(file);
  const path = getFilePath({ category, name });

  if (!rawFile) {
    return makeHttpError({
      statusCode: 400,
      error: 'Invalid File provided',
    });
  }

  await Promise.all([
    FileModel.create({ path, ...fileMeta }),
    rawFile.mv(path),
  ]);

  return makeHttpResponse({
    statusCode: 200,
  });
};

module.exports = {
  performFileUpload,
  getFileFromNestedObj,
};
