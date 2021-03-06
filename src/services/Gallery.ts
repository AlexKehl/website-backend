import { mkdir, unlink, writeFile } from 'fs/promises';
import { join } from 'path';
import { IMAGE_PATH } from '../../config';
import { GalleryImage, GalleryImageDoc } from '../model/GalleryImage';
import { HttpResponse } from '../types';
import { handleHttpErrors, tryToExecute } from '../utils/HttpErrors';
import { makeHttpResponse } from '../utils/HttpResponses';
import HttpStatus from '../../common/constants/HttpStatus';
import {
  DeleteGalleryImageDto,
  GalleryImageDto,
} from '../../common/interface/Dto';
import { ImageForGallery } from '../../common/interface/ConsumerData';
import { Category } from '../../common/interface/Constants';
import { GalleryImageMeta } from '../../common/interface/GalleryImages';

const isImageExistingInDb = async (category: Category, id: string) =>
  tryToExecute<GalleryImageDoc>({
    fnToTry: async () => await GalleryImage.findOne({ id, category }),
    httpErrorData: {
      statusCode: HttpStatus.NOT_FOUND,
      data: { error: 'GalleryImage is not existing.' },
    },
  });

const writeImageToDisk =
  (category: Category) =>
  async (fileObj: GalleryImageDto): Promise<GalleryImageDto> => {
    return tryToExecute<GalleryImageDto>({
      fnToTry: async () => {
        await mkdir(join(IMAGE_PATH, category), { recursive: true });
        await writeFile(
          join(IMAGE_PATH, category, fileObj.id),
          fileObj.image,
          'base64'
        );
        return true;
      },
      httpErrorData: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: { error: 'Server has problems with saving the GalleryImage.' },
      },
      passThrough: fileObj,
    });
  };

const saveFileMetaToDb =
  (category: Category) => async (file: GalleryImageDto) => {
    return GalleryImage.create({ ...file, category: category });
  };

const uploadFile =
  (category: Category) =>
  (fileObj: GalleryImageDto): Promise<any> =>
    Promise.all([
      writeImageToDisk(category)(fileObj),
      saveFileMetaToDb(category)(fileObj),
    ]);

const updateFile = async (dto: GalleryImageDto): Promise<any> =>
  tryToExecute<GalleryImageDto[]>({
    fnToTry: async () =>
      GalleryImage.updateOne(
        { id: dto.id, category: dto.category },
        { ...dto }
      ),
    passThrough: dto,
    httpErrorData: {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      data: { error: 'Internal server error' },
    },
  });

const deleteFile = ({ category, id }: DeleteGalleryImageDto): Promise<any> =>
  Promise.all([
    unlink(join(IMAGE_PATH, category, id)),
    GalleryImage.deleteOne({ category, id }),
  ]);

export const generateImagePathHttpResponse = (
  category: Category,
  id: GalleryImageMeta['id']
) =>
  makeHttpResponse({
    statusCode: HttpStatus.OK,
    data: { imagePath: join(category, id) },
  });

const imageForConsumerMap = (
  fileDocs: GalleryImageDoc[]
): ImageForGallery[] => {
  return fileDocs.map((fileDoc) => ({
    url: `/files/${fileDoc.category}/${fileDoc.id}`,
    id: fileDoc.id,
    isForSell: fileDoc.isForSell,
    description: fileDoc.description,
    price: fileDoc.price,
    category: fileDoc.category,
    name: fileDoc.name,
    width: fileDoc.width,
    height: fileDoc.height,
  }));
};

const createImagesForConsumerHttpResponse = (
  images: ImageForGallery[]
): HttpResponse =>
  makeHttpResponse({
    statusCode: HttpStatus.OK,
    data: { images },
  });

const getImagesDocsForCategory = (category: Category) =>
  tryToExecute<GalleryImageDoc[]>({
    fnToTry: async () => GalleryImage.find({ category }).lean(),
    httpErrorData: {
      statusCode: HttpStatus.NOT_FOUND,
      data: { error: 'No images stored for this category' },
    },
  });

const uploadImage = async (dto: GalleryImageDto) =>
  isImageExistingInDb(dto.category, dto.id)
    .then(() => updateFile(dto))
    .catch(() => uploadFile(dto.category)(dto))
    .then(() => makeHttpResponse({ statusCode: HttpStatus.OK }))
    .catch(handleHttpErrors);

const deleteImage = (dto: DeleteGalleryImageDto) =>
  isImageExistingInDb(dto.category, dto.id)
    .then(() => deleteFile(dto))
    .then(() => makeHttpResponse({ statusCode: HttpStatus.OK }))
    .catch(handleHttpErrors);

const getImagePath = (category: Category, id: GalleryImageMeta['id']) =>
  isImageExistingInDb(category, id)
    .then(() => generateImagePathHttpResponse(category, id))
    .catch(handleHttpErrors);

const getImagePathsForCategory = async (category: Category) =>
  getImagesDocsForCategory(category)
    .then(imageForConsumerMap)
    .then(createImagesForConsumerHttpResponse)
    .catch(handleHttpErrors);

export {
  uploadFile,
  deleteFile,
  deleteImage,
  imageForConsumerMap,
  getImagePathsForCategory,
  getImagePath,
  uploadImage,
};
