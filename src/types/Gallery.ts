import { GalleryImageDoc } from '../model/GalleryImage';
import { GalleryImageDto, ImageWithMeta } from './Dto';
import { SerializedFileObj } from './Files';

export type SerializedGalleryObj = SerializedFileObj<GalleryImageDto>;

export interface GalleryImagesToSync {
  toUpload: ImageWithMeta[];
  toDelete: GalleryImageDoc[];
}
