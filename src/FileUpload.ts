import { UploadedFile } from 'express-fileupload';
import FileModel from './model/File';
import { FileObj, FileUpload } from './types';
import { makeHttpError } from './utils/HttpError';
import { makeHttpResponse } from './utils/HttpResponse';

const getFilePath = ({ category, name }: { category: string; name: string }) =>
  `${process.env.FILE_PATH}/${category}/${name}`;

const getFileFromNestedObj = (uploadedFile: FileObj): UploadedFile => {
  const objectValues = Object.values(uploadedFile);
  return objectValues[0];
};

const performFileUpload = async ({
  body,
  file,
}: Pick<FileUpload, 'body' | 'file'>) => {
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
