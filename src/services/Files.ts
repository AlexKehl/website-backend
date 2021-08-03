import { differenceWith } from 'lodash';
import { WithBody } from '../types';
import { CreateFilesToSyncObjInput, SerializedFileObj } from '../types/Files';

const serializeFileObjects = <T>(
  req: WithBody<any>
): SerializedFileObj<T>[] => {
  return (req.files as Express.Multer.File[]).map((file) => {
    const { originalname, buffer, size, mimetype } = file;
    return { ...req.body, originalname, buffer, size, mimetype };
  });
};

const createFilesToSyncObj = <T, U>({
  fileDocs,
  serializedFileObjects,
  pred,
}: CreateFilesToSyncObjInput<T, U>) => {
  const toDelete = differenceWith(fileDocs, serializedFileObjects, pred);

  const toUpload = differenceWith(
    serializedFileObjects,
    fileDocs,
    (obj, fileDoc) => pred(fileDoc, obj)
  );

  return { toUpload, toDelete };
};

export { serializeFileObjects, createFilesToSyncObj };
