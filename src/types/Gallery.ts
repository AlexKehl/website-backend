import { GalleryImageDoc } from '../model/GalleryImage';
import { GalleryImageDto } from './Dto';
import { SerializedFileObj } from './Files';

export type SerializedGalleryObj = SerializedFileObj<GalleryImageDto>;

export interface GalleryImagesToSync {
  toUpload: SerializedGalleryObj[];
  toDelete: GalleryImageDoc[];
}
