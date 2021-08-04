import { TranslatedText } from './Texts';

export interface FileDoc {
  id: string;
  name: string;
  description?: TranslatedText;
}

export type SerializedFileObj<T> = T &
  Pick<Express.Multer.File, 'originalname' | 'buffer' | 'size' | 'mimetype'>;

export interface CreateFilesToSyncObjInput<T, U> {
  fileDocs: T[];
  imagesWithMeta: U[];
  pred: (file: T, obj: U) => boolean;
}
