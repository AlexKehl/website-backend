import {
  DeleteGalleryImageDto,
  GalleryImageDto,
} from '../../common/interface/Dto';
import { IMAGE_PATH } from '../../config';
import {
  deleteImage,
  getImagePath,
  getImagePathsForCategory,
  uploadImage,
} from '../services/Gallery';
import { Category, ExpressObj } from '../types';
import { evaluateHttpObject } from '../utils/HttpResponses';

const galleryUploadController = async ({
  req,
  res,
}: ExpressObj<GalleryImageDto>) => {
  evaluateHttpObject(res, await uploadImage(req.body));
};

const galleryDeleteController = async ({
  req,
  res,
}: ExpressObj<DeleteGalleryImageDto>) => {
  evaluateHttpObject(res, await deleteImage(req.body));
};

const getImagePathsForCategoryController = async ({ req, res }: ExpressObj) => {
  evaluateHttpObject(
    res,
    await getImagePathsForCategory(req.params.category as Category)
  );
};

const getImageByCategoryController = async ({ req, res }: ExpressObj) => {
  const { statusCode, headers, data } = await getImagePath(
    req.params.category as Category,
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
  galleryUploadController,
  getImagePathsForCategoryController,
  getImageByCategoryController,
  galleryDeleteController,
};
