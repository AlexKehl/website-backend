import { BASE_URL } from '../../config';
import { GalleryImageDoc } from '../../src/model/GalleryImage';
import { ImageForGallery, SerializedGalleryObj } from '../../src/types';

export const serializedFileObj: SerializedGalleryObj = {
  isForSell: true,
  description: { en: 'This is a description' },
  originalname: 'i-201.jpg',
  mimetype: 'image/jpeg',
  buffer: Buffer.from([8, 6, 7, 5, 3, 0, 9]),
  size: 473101,
  category: 'acryl',
};

export const fileDoc: GalleryImageDoc = {
  id: 'id123',
  isForSell: true,
  price: 50,
  description: { en: 'This is a description' },
  category: 'acryl',
  name: 'i-201.jpg',
};

export const fileDocs: GalleryImageDoc[] = [
  {
    category: 'acryl',
    name: 'foo.jpg',
    id: 'id124',
    isForSell: true,
    price: 50,
    description: { en: 'This is a description' },
  },
  {
    category: 'oil',
    name: 'bar.jpg',
    id: 'id125',
    isForSell: true,
    price: 50,
    description: { en: 'This is a description' },
  },
];

export const imagesForConsumer: ImageForGallery[] = [
  {
    name: 'foo.jpg',
    category: 'acryl',
    url: `${BASE_URL}/files/acryl/foo.jpg`,
    isForSell: true,
    id: 'id124',
    price: 50,
    description: { en: 'This is a description' },
  },
  {
    name: 'bar.jpg',
    category: 'oil',
    url: `${BASE_URL}/files/oil/bar.jpg`,
    isForSell: true,
    id: 'id125',
    price: 50,
    description: { en: 'This is a description' },
  },
];
