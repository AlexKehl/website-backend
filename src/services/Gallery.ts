import { v4 as uuid } from 'uuid';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { join } from 'path';
import { BASE_URL, IMAGE_PATH } from '../../config';
import { GalleryImage, GalleryImageDoc } from '../model/GalleryImage';
import {
  FileWithCategoryDto,
  GalleryImageDto,
  HttpResponse,
  ImageForGallery,
  SerializedGalleryObj,
  WithBody,
  GalleryImagesToSync,
} from '../types';
import { handleHttpErrors, tryToExecute } from '../utils/HttpErrors';
import { makeHttpResponse } from '../utils/HttpResponses';
import HttpStatus from '../utils/HttpStatus';
import { createFilesToSyncObj, serializeFileObjects } from './Files';

const isImageNotExistingInDb = async ({
  category,
  name,
}: FileWithCategoryDto) =>
  tryToExecute<FileWithCategoryDto>({
    fnToTry: async () => await GalleryImage.findOne({ name, category }),
    httpErrorData: {
      statusCode: HttpStatus.NOT_FOUND,
      data: { error: 'GalleryImage is not existing.' },
    },
    passThrough: { category, name },
  });

const writeImageToDisk = async (
  fileObj: SerializedGalleryObj
): Promise<SerializedGalleryObj> => {
  const { category, originalname, buffer } = fileObj;
  return tryToExecute<SerializedGalleryObj>({
    fnToTry: async () => {
      await mkdir(join(IMAGE_PATH, category), { recursive: true });
      await writeFile(join(IMAGE_PATH, category, originalname), buffer);
      return true;
    },
    httpErrorData: {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      data: { error: 'Server has problems with saving the GalleryImage.' },
    },
    passThrough: fileObj,
  });
};

const saveFileMetaToDb = async (file: SerializedGalleryObj) => {
  return GalleryImage.create({
    id: uuid(),
    description: file.description,
    price: file.price,
    name: file.originalname,
    category: file.category,
    isForSell: file.isForSell,
  });
};

const uploadFile = (fileObj: SerializedGalleryObj): Promise<any> =>
  Promise.all([writeImageToDisk(fileObj), saveFileMetaToDb(fileObj)]);

const deleteFile = ({ category, name }: GalleryImageDoc): Promise<any> =>
  Promise.all([
    unlink(join(IMAGE_PATH, category, name)),
    GalleryImage.deleteOne({ category, name }),
  ]);

const generateImagePathHttpResponse = ({
  category,
  name,
}: FileWithCategoryDto) =>
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
  }));
};

const createImagesForConsumerHttpResponse = (
  images: ImageForGallery[]
): HttpResponse =>
  makeHttpResponse({
    statusCode: HttpStatus.OK,
    data: { images },
  });

const getImagesDocsForCategory = (category: string) =>
  tryToExecute<GalleryImageDoc[]>({
    fnToTry: async () => GalleryImage.find({ category }).lean(),
    httpErrorData: {
      statusCode: HttpStatus.NOT_FOUND,
      data: { error: 'No images stored for this category' },
    },
  });

const getInputsForFilesToSyncObj = (category: string) => async (
  serializeFileObjects: SerializedGalleryObj[]
) => {
  const imagesForCategory = await getImagesDocsForCategory(category);
  return createFilesToSyncObj<GalleryImageDoc, SerializedGalleryObj>({
    fileDocs: imagesForCategory,
    serializedFileObjects: serializeFileObjects,
    pred: (imageDoc, obj) =>
      imageDoc.category === obj.category && imageDoc.name === obj.originalname,
  });
};

const processFilesToSync = async ({
  toDelete,
  toUpload,
}: GalleryImagesToSync) => {
  const uploadPromises = toUpload.map(uploadFile);
  const deletePromises = toDelete.map(deleteFile);
  return Promise.all([...uploadPromises, ...deletePromises]);
};

const getImagePath = (category: string, name: string) =>
  isImageNotExistingInDb({ category, name })
    .then(generateImagePathHttpResponse)
    .catch(handleHttpErrors);

const syncFiles = (req: WithBody<GalleryImageDto>) =>
  Promise.resolve(serializeFileObjects<GalleryImageDto>(req))
    .then(getInputsForFilesToSyncObj(req.body.category))
    .then(processFilesToSync)
    .then(() => makeHttpResponse({ statusCode: HttpStatus.OK }))
    .catch(handleHttpErrors);

const getImagePathsForCategory = async (category: string) =>
  getImagesDocsForCategory(category)
    .then(imageForConsumerMap)
    .then(createImagesForConsumerHttpResponse)
    .catch(handleHttpErrors);

export {
  serializeFileObjects,
  uploadFile,
  deleteFile,
  imageForConsumerMap,
  getImagePathsForCategory,
  getImagePath,
  syncFiles,
};
