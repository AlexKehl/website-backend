import { ImageSize } from './ClientInterface';

export interface FileDoc {
  id: string;
  name: string;
  description?: string;
  size: ImageSize;
}

export interface CreateFilesToSyncObjInput<T, U> {
  fileDocs: T[];
  imagesWithMeta: U[];
  pred: (file: T, obj: U) => boolean;
}
