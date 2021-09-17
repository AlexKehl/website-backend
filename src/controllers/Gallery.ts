import { Category } from '../../common/interface/Constants';
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
import { Controller } from '../types';
import { evaluateHttpObject } from '../utils/HttpResponses';

const galleryUploadController: Controller<GalleryImageDto> = async ({
  req,
  res,
}) => {
  evaluateHttpObject(res, await uploadImage(req.body));
};

const galleryDeleteController: Controller<DeleteGalleryImageDto> = async ({
  req,
  res,
}) => {
  evaluateHttpObject(res, await deleteImage(req.body));
};

const getImagePathsForCategoryController: Controller = async ({ req, res }) => {
  evaluateHttpObject(
    res,
    await getImagePathsForCategory(req.params.category as Category)
  );
};

const getImageByCategoryController: Controller = async ({ req, res }) => {
  const { statusCode, headers, data } = await getImagePath(
    req.params.category as Category,
    req.params.name
  );
  if (!data?.success) {
    res.set(headers).status(statusCode).send(data);
  } else {
    res.sendFile(data?.imagePath, {
      root: `${IMAGE_PATH}/`,
    });
  }
};

export {
  galleryUploadController,
  getImagePathsForCategoryController,
  getImageByCategoryController,
  galleryDeleteController,
};
