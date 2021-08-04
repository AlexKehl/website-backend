import { Role } from '.';
import { OrderDoc } from '../model/Order';
import { TranslatedText } from './Texts';

export interface Order extends OrderDoc {}

export interface ImageForGallery {
  id: string;
  url: string;
  category: string;
  name: string;
  description?: TranslatedText;
  isForSell: boolean;
  price?: number;
}

export interface UserResponse {
  email: string;
  roles: Role[];
}
