import { IMAGE_PATH } from '../../config';
import {
  getImagePath,
  getImagePathsForCategory,
  syncFiles,
} from '../services/Files';
import { ExpressObj, FileDto } from '../types';

const fileSyncController = async ({ req, res }: ExpressObj<FileDto>) => {
  const { headers, statusCode, data } = await syncFiles(req);
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
  fileSyncController,
  getImagePathsForCategoryController,
  getImageByCategoryController,
};
