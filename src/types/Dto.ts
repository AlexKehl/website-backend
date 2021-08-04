import { OrderLevel } from '../model/Order';
import { TranslatedText } from './Texts';

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
  description?: TranslatedText;
  isForSell: boolean;
  price?: number;
  image: string;
  name: string;
}

export interface GalleryImageDto {
  images: ImageWithMeta[];
  category: string;
}

export interface FileWithCategoryDto {
  category: string;
  name: string;
}

export interface OrderImageDto {
  level: OrderLevel;
}
