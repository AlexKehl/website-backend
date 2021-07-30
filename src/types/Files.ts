import { FileDoc } from '../model/File';
import { FileDto } from './Dto';

export type SerializedFileObj = FileDto &
  Pick<Express.Multer.File, 'originalname' | 'buffer' | 'size' | 'mimetype'>;

export interface ImageForConsumer {
  name: string;
  url: string;
  category: string;
}

export interface FilesToSync {
  toUpload: SerializedFileObj[];
  toDelete: FileDoc[];
}
