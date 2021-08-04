import { differenceWith } from 'lodash';
import { CreateFilesToSyncObjInput } from '../types/Files';

const createFilesToSyncObj = <T, U>({
  fileDocs,
  imagesWithMeta,
  pred,
}: CreateFilesToSyncObjInput<T, U>) => {
  const toDelete = differenceWith(fileDocs, imagesWithMeta, pred);

  const toUpload = differenceWith(imagesWithMeta, fileDocs, (obj, fileDoc) =>
    pred(fileDoc, obj)
  );

  return { toUpload, toDelete };
};

export { createFilesToSyncObj };
