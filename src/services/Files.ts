import {
  FileDeleteDto,
  FileDto,
  HttpResponse,
  ImageForConsumer,
  SerializedFileObj,
  WithBody,
} from '../types';
import { File, FileDoc } from '../model/File';
import {
  handleHttpErrors,
  makeHttpError,
  tryToExecute,
} from '../utils/HttpErrors';
import HttpStatus from '../utils/HttpStatus';
import { intersection } from 'lodash';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { join } from 'path';
import { BASE_URL, IMAGE_PATH } from '../../config';
import { makeHttpResponse } from '../utils/HttpResponses';

const serializeFileObj = (req: WithBody<FileDto>): SerializedFileObj => {
  const { originalname, buffer, size, mimetype } = req.file!;
  return { ...req.body, originalname, buffer, size, mimetype };
};

const hasFile = (fileObj: SerializedFileObj): Promise<SerializedFileObj> => {
  const requiredFileKeys = ['originalname', 'mimetype', 'buffer', 'size'];

  const areAllFileKeysPresent =
    intersection(requiredFileKeys, Object.keys(fileObj)).length ===
    requiredFileKeys.length;

  return areAllFileKeysPresent
    ? Promise.resolve(fileObj)
    : Promise.reject(
        makeHttpError({
          statusCode: HttpStatus.BAD_REQUEST,
          data: { error: 'Corrupt File' },
        })
      );
};

const hasNoFileConflict = async (fileObj: SerializedFileObj) =>
  tryToExecute<SerializedFileObj>({
    fnToTry: async () =>
      !(await File.findOne({
        name: fileObj.originalname,
        category: fileObj.category,
      })),
    httpErrorData: {
      statusCode: HttpStatus.CONFLICT,
      data: { error: 'File with this name and category exists' },
    },
    passThrough: fileObj,
  });

const isFileNotExistingInDb = async ({ category, name }: FileDeleteDto) =>
  tryToExecute<FileDeleteDto>({
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

const uploadFile = (req: WithBody<FileDto>) =>
  Promise.resolve(serializeFileObj(req))
    .then(hasFile)
    .then(hasNoFileConflict)
    .then(writeFileToDisk)
    .then(saveFileMetaToDb)
    .then(() => makeHttpResponse({ statusCode: HttpStatus.OK }))
    .catch(handleHttpErrors);

const deleteFile = ({ category, name }: FileDeleteDto) =>
  isFileNotExistingInDb({ category, name })
    .then(() => unlink(join(IMAGE_PATH, category, name)))
    .then(() => File.deleteOne({ category, name }))
    .then(() => makeHttpResponse({ statusCode: HttpStatus.OK }))
    .catch(handleHttpErrors);

// async getImagePath(category: string, imageName: string) {
//   if (!this.isImageExistingOnDisk(category, imageName)) {
//     throw new NotFoundException();
//   }
//   return join(category, imageName);
// }
//
const imageForConsumerMap = (fileDocs: FileDoc[]): ImageForConsumer[] => {
  return fileDocs.map(({ category, name }) => ({
    category,
    name,
    url: `${BASE_URL}/files/image/${category}/${name}`,
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
  tryToExecute({
    fnToTry: async () => File.find({ category }).lean(),
    httpErrorData: {
      statusCode: HttpStatus.NOT_FOUND,
      data: { error: 'No images stored for this category' },
    },
  });

const getImagePathsForCategory = async (
  category: string
): Promise<HttpResponse> => {
  const imagesForCategoryDocs = await File.find({ category }).lean();
  const imagesForConsumer = imageForConsumerMap(imagesForCategoryDocs);
  return createImagesForConsumerHttpResponse(imagesForConsumer);
};

export {
  serializeFileObj,
  hasFile,
  uploadFile,
  deleteFile,
  imageForConsumerMap,
  getImagePathsForCategory,
};
