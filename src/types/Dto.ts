import { Category } from '.';
import { OrderLevel } from '../model/Order';
import { ImageSize } from './ClientInterface';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  email: string;
  refreshToken: string;
}

export interface EmailDto {
  email: string;
}

export interface ImageWithMeta {
  description?: string;
  isForSell: boolean;
  price?: number;
  image: string;
  name: string;
  size: ImageSize;
}

export interface GalleryImageDto {
  description?: string;
  isForSell: boolean;
  price?: number;
  image: string;
  name: string;
  size: ImageSize;
  category: Category;
}

export interface GalleryImageUploadDto {
  images: ImageWithMeta[];
  category: Category;
}

export interface FileWithCategoryDto {
  category: Category;
  name: string;
}

export interface OrderImageDto {
  level: OrderLevel;
}

export interface DeleteGalleryImageDto {
  category: Category;
  name: string;
}
