import { IMAGE_PATH } from '../../config';
import {
  getImagePath,
  getImagePathsForCategory,
  syncFiles,
} from '../services/Files';
import { ExpressObj, FileDto } from '../types';
import { evaluateHttpObject } from '../utils/HttpResponses';

const fileSyncController = async ({ req, res }: ExpressObj<FileDto>) => {
  evaluateHttpObject(res, await syncFiles(req));
};

const getImagePathsForCategoryController = async ({ req, res }: ExpressObj) => {
  evaluateHttpObject(res, await getImagePathsForCategory(req.params.category));
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
