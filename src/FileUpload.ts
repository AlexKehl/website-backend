import { UploadedFile } from 'express-fileupload';
import FileModel from 'src/model/File';
import { makeHttpError } from 'src/utils/HttpError';
import { makeHttpResponse } from 'src/utils/HttpResponse';
import { FileUpload } from './types';

const getFilePath = ({ category, name }) =>
  `${process.env.FILE_PATH}/${category}/${name}`;

const getFileFromNestedObj = (uploadedFile: {
  [x: string]: UploadedFile;
}): UploadedFile => {
  const objectValues = Object.values(uploadedFile);
  return objectValues[0];
};

const performFileUpload = async ({ body, file }: Partial<FileUpload>) => {
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

export { performFileUpload, getFileFromNestedObj };
