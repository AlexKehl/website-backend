import {
  deleteFile,
  getImagePathsForCategory,
  uploadFile,
} from '../services/Files';
import { ExpressObj, FileDeleteDto, FileDto } from '../types';

const fileUploadController = async ({ req, res }: ExpressObj<FileDto>) => {
  const { headers, statusCode, data } = await uploadFile(req);
  res.set(headers).status(statusCode).send(data);
};

const fileDeleteController = async ({
  req,
  res,
}: ExpressObj<FileDeleteDto>) => {
  const { headers, statusCode, data } = await deleteFile(req.body);
  res.set(headers).status(statusCode).send(data);
};

const getImagePathsForCategoryController = async ({ req, res }: ExpressObj) => {
  const { headers, statusCode, data } = await getImagePathsForCategory(
    req.params.category
  );
  res.set(headers).status(statusCode).send(data);
};

export {
  fileUploadController,
  fileDeleteController,
  getImagePathsForCategoryController,
};
