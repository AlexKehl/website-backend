import { GalleryImageDoc } from '../model/GalleryImage';
import { GalleryImageDto } from './Dto';

export type SerializedGalleryObj = GalleryImageDto &
  Pick<Express.Multer.File, 'originalname' | 'buffer' | 'size' | 'mimetype'>;

export interface GalleryImagesToSync {
  toUpload: SerializedGalleryObj[];
  toDelete: GalleryImageDoc[];
}
