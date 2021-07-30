import { mkdir, unlink, writeFile } from 'fs/promises';
import { differenceWith, intersection } from 'lodash';
import { join } from 'path';
import { BASE_URL, IMAGE_PATH } from '../../config';
import { File, FileDoc } from '../model/File';
import {
  FileWithCategoryDto,
  FileDto,
  HttpResponse,
  ImageForConsumer,
  SerializedFileObj,
  WithBody,
  FilesToSync,
} from '../types';
import WithPayloadError from '../utils/Exceptions/WithPayloadError';
import { handleHttpErrors, tryToExecute } from '../utils/HttpErrors';
import { makeHttpResponse } from '../utils/HttpResponses';
import HttpStatus from '../utils/HttpStatus';

const serializeFileObjects = (req: WithBody<FileDto>): SerializedFileObj[] => {
  return (req.files as Express.Multer.File[]).map((file) => {
    const { originalname, buffer, size, mimetype } = file;
    return { ...req.body, originalname, buffer, size, mimetype };
  });
};

const isFileValid = (fileObj: SerializedFileObj): boolean => {
  const requiredFileKeys = ['originalname', 'mimetype', 'buffer', 'size'];

  const areAllFileKeysPresent =
    intersection(requiredFileKeys, Object.keys(fileObj)).length ===
    requiredFileKeys.length;

  return areAllFileKeysPresent && fileObj.size > 0;
};

const validateFiles = (
  fileObjects: SerializedFileObj[]
): Promise<SerializedFileObj[]> => {
  const areAllFilesValid = fileObjects.every(isFileValid);
  return areAllFilesValid
    ? Promise.resolve(fileObjects)
    : Promise.reject(
        new WithPayloadError({
          statusCode: HttpStatus.BAD_REQUEST,
          data: { error: 'Corrupt Files' },
        })
      );
};

const createFilesToSyncObj = (fileDocs: FileDoc[]) => async (
  serializedFileObjects: SerializedFileObj[]
): Promise<FilesToSync> => {
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
  fileObj: SerializedFileObj
): Promise<SerializedFileObj> => {
  const { category, originalname, buffer } = fileObj;
  return tryToExecute<SerializedFileObj>({
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

const saveFileMetaToDb = async (file: SerializedFileObj) => {
  return File.create({
    name: file.originalname,
    category: file.category,
  });
};

const uploadFile = (fileObj: SerializedFileObj): Promise<any> =>
  Promise.all([writeFileToDisk(fileObj), saveFileMetaToDb(fileObj)]);

const deleteFile = ({ category, name }: FileDoc): Promise<any> =>
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

const imageForConsumerMap = (fileDocs: FileDoc[]): ImageForConsumer[] => {
  return fileDocs.map(({ category, name }) => ({
    category,
    name,
    url: `${BASE_URL}/files/${category}/${name}`,
  }));
};

const createImagesForConsumerHttpResponse = (
  images: ImageForConsumer[]
): HttpResponse =>
  makeHttpResponse({
    statusCode: HttpStatus.OK,
    data: { images },
  });

const getImagesDocsForCategory = (category: string) =>
  tryToExecute<FileDoc[]>({
    fnToTry: async () => File.find({ category }).lean(),
    httpErrorData: {
      statusCode: HttpStatus.NOT_FOUND,
      data: { error: 'No images stored for this category' },
    },
  });

const getInputsForFilesToSyncObj = (category: string) => async (
  serializeFileObjects: SerializedFileObj[]
) => {
  const imagesForCategory = await getImagesDocsForCategory(category);
  return createFilesToSyncObj(imagesForCategory)(serializeFileObjects);
};

const processFilesToSync = async ({ toDelete, toUpload }: FilesToSync) => {
  const uploadPromises = toUpload.map(uploadFile);
  const deletePromises = toDelete.map(deleteFile);
  return Promise.all([...uploadPromises, ...deletePromises]);
};

const getImagePath = (category: string, name: string) =>
  isFileNotExistingInDb({ category, name })
    .then(generateImagePathHttpResponse)
    .catch(handleHttpErrors);

const syncFiles = (req: WithBody<FileDto>) =>
  Promise.resolve(serializeFileObjects(req))
    .then(validateFiles)
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
  isFileValid,
  uploadFile,
  deleteFile,
  imageForConsumerMap,
  getImagePathsForCategory,
  getImagePath,
  syncFiles,
};
