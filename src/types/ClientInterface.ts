import { Category, Role } from '.';
import { OrderDoc } from '../model/Order';

export interface Order extends OrderDoc {}

export interface ImageSize {
  width: number;
  height: number;
}

export interface ImageForGallery {
  id: string;
  url: string;
  category: Category;
  name: string;
  description?: string;
  isForSell: boolean;
  price?: number;
  size: ImageSize;
}

export interface UserResponse {
  email: string;
  roles: Role[];
}
