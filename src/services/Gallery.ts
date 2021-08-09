import { v4 as uuid } from 'uuid';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { join } from 'path';
import { BASE_URL, IMAGE_PATH } from '../../config';
import { GalleryImage, GalleryImageDoc } from '../model/GalleryImage';
import { HttpResponse, Category } from '../types';
import { handleHttpErrors, tryToExecute } from '../utils/HttpErrors';
import { makeHttpResponse } from '../utils/HttpResponses';
import HttpStatus from '../utils/HttpStatus';
import {
  DeleteGalleryImageDto,
  GalleryImageDto,
} from '../../../common/interface/Dto';
import { ImageForGallery } from '../../../common/interface/ConsumerData';

const isImageNotExistingInDb = async (category: Category, name: string) =>
  tryToExecute({
    fnToTry: async () => await GalleryImage.findOne({ name, category }),
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
          join(IMAGE_PATH, category, fileObj.name),
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
    return GalleryImage.create({
      id: uuid(),
      description: file.description,
      price: file.price,
      name: file.name,
      category: category,
      isForSell: file.isForSell,
      size: file.size,
    });
  };

const uploadFile =
  (category: Category) =>
  (fileObj: GalleryImageDto): Promise<any> =>
    Promise.all([
      writeImageToDisk(category)(fileObj),
      saveFileMetaToDb(category)(fileObj),
    ]);

const deleteFile = ({ category, name }: DeleteGalleryImageDto): Promise<any> =>
  Promise.all([
    unlink(join(IMAGE_PATH, category, name)),
    GalleryImage.deleteOne({ category, name }),
  ]);

const generateImagePathHttpResponse = (category: Category, name: string) =>
  makeHttpResponse({
    statusCode: HttpStatus.OK,
    data: { imagePath: join(category, name) },
  });

const imageForConsumerMap = (
  fileDocs: GalleryImageDoc[]
): ImageForGallery[] => {
  return fileDocs.map((fileDoc) => ({
    id: fileDoc.id,
    isForSell: fileDoc.isForSell,
    description: fileDoc.description,
    price: fileDoc.price,
    category: fileDoc.category,
    name: fileDoc.name,
    url: `${BASE_URL}/files/${fileDoc.category}/${fileDoc.name}`,
    size: fileDoc.size,
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
  uploadFile(dto.category)(dto)
    .then(() => makeHttpResponse({ statusCode: HttpStatus.OK }))
    .catch(handleHttpErrors);

const deleteImage = (dto: DeleteGalleryImageDto) =>
  deleteFile(dto)
    .then(() => makeHttpResponse({ statusCode: HttpStatus.OK }))
    .catch(handleHttpErrors);

const getImagePath = (category: Category, name: string) =>
  isImageNotExistingInDb(category, name)
    .then(() => generateImagePathHttpResponse(category, name))
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
