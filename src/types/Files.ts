import { ImageSize } from '../../../common/interface/GalleryImages';

export interface FileDoc {
  id: string;
  name: string;
  description?: string;
  size: ImageSize;
}
