import { GalleryImageDoc } from '../model/GalleryImage';
import { ImageWithMeta } from './Dto';

export interface GalleryImagesToSync {
  toUpload: ImageWithMeta[];
  toDelete: GalleryImageDoc[];
}
