import { FileDto } from './Dto';

export type SerializedFileObj = FileDto &
  Pick<Express.Multer.File, 'originalname' | 'buffer' | 'size' | 'mimetype'>;
