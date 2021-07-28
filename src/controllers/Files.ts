import { IMAGE_PATH } from '../../config';
import {
  deleteFile,
  getImagePath,
  getImagePathsForCategory,
  uploadFile,
} from '../services/Files';
import { ExpressObj, FileWithCategoryDto, FileDto } from '../types';

const fileUploadController = async ({ req, res }: ExpressObj<FileDto>) => {
  const { headers, statusCode, data } = await uploadFile(req);
  res.set(headers).status(statusCode).send(data);
};

const fileDeleteController = async ({
  req,
  res,
}: ExpressObj<FileWithCategoryDto>) => {
  const { headers, statusCode, data } = await deleteFile(req.body);
  res.set(headers).status(statusCode).send(data);
};

const getImagePathsForCategoryController = async ({ req, res }: ExpressObj) => {
  const { headers, statusCode, data } = await getImagePathsForCategory(
    req.params.category
  );
  res.set(headers).status(statusCode).send(data);
};

const getImageByCategoryController = async ({ req, res }: ExpressObj) => {
  const { statusCode, headers, data } = await getImagePath(
    req.params.category,
    req.params.name
  );
  if (!data?.success) {
    res.set(headers).status(statusCode).send(data);
  }
  res.sendFile(data?.imagePath, {
    root: `${IMAGE_PATH}/`,
  });
};

export {
  fileUploadController,
  fileDeleteController,
  getImagePathsForCategoryController,
  getImageByCategoryController,
};
