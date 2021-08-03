import { v4 as uuid } from 'uuid';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { differenceWith } from 'lodash';
import { join } from 'path';
import { BASE_URL, IMAGE_PATH } from '../../config';
import { File, GalleryImageDoc } from '../model/GalleryImage';
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

const serializeFileObjects = (
  req: WithBody<GalleryImageDto>
): SerializedGalleryObj[] => {
  return (req.files as Express.Multer.File[]).map((file) => {
    const { originalname, buffer, size, mimetype } = file;
    return { ...req.body, originalname, buffer, size, mimetype };
  });
};

const createFilesToSyncObj = (fileDocs: GalleryImageDoc[]) => async (
  serializedFileObjects: SerializedGalleryObj[]
): Promise<GalleryImagesToSync> => {
  const toDelete = differenceWith(
    fileDocs,
    serializedFileObjects,
    (fileDoc, obj) =>
      fileDoc.category === obj.category && fileDoc.name === obj.originalname
  );

  const toUpload = differenceWith(
    serializedFileObjects,
    fileDocs,
    (obj, fileDoc) =>
      fileDoc.category === obj.category && fileDoc.name === obj.originalname
  );

  return { toUpload, toDelete };
};

const isFileNotExistingInDb = async ({ category, name }: FileWithCategoryDto) =>
  tryToExecute<FileWithCategoryDto>({
    fnToTry: async () => await File.findOne({ name, category }),
    httpErrorData: {
      statusCode: HttpStatus.NOT_FOUND,
      data: { error: 'File is not existing.' },
    },
    passThrough: { category, name },
  });

const writeFileToDisk = async (
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
      data: { error: 'Server has problems with saving the file.' },
    },
    passThrough: fileObj,
  });
};

const saveFileMetaToDb = async (file: SerializedGalleryObj) => {
  return File.create({
    id: uuid(),
    description: file.description,
    price: file.price,
    name: file.originalname,
    category: file.category,
    isForSell: file.isForSell,
  });
};

const uploadFile = (fileObj: SerializedGalleryObj): Promise<any> =>
  Promise.all([writeFileToDisk(fileObj), saveFileMetaToDb(fileObj)]);

const deleteFile = ({ category, name }: GalleryImageDoc): Promise<any> =>
  Promise.all([
    unlink(join(IMAGE_PATH, category, name)),
    File.deleteOne({ category, name }),
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
    fnToTry: async () => File.find({ category }).lean(),
    httpErrorData: {
      statusCode: HttpStatus.NOT_FOUND,
      data: { error: 'No images stored for this category' },
    },
  });

const getInputsForFilesToSyncObj = (category: string) => async (
  serializeFileObjects: SerializedGalleryObj[]
) => {
  const imagesForCategory = await getImagesDocsForCategory(category);
  return createFilesToSyncObj(imagesForCategory)(serializeFileObjects);
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
  isFileNotExistingInDb({ category, name })
    .then(generateImagePathHttpResponse)
    .catch(handleHttpErrors);

const syncFiles = (req: WithBody<GalleryImageDto>) =>
  Promise.resolve(serializeFileObjects(req))
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
  createFilesToSyncObj,
  serializeFileObjects,
  uploadFile,
  deleteFile,
  imageForConsumerMap,
  getImagePathsForCategory,
  getImagePath,
  syncFiles,
};
