import { BASE_URL } from '../../config';
import { GalleryImageDoc } from '../../src/model/GalleryImage';
import { ImageForGallery, ImageWithMeta } from '../../src/types';

export const imageWithMeta: ImageWithMeta = {
  isForSell: true,
  description: { en: 'This is a description' },
  name: 'i-201.jpg',
  image: 'someBase64EncodedImage',
  size: { width: 100, height: 100 },
};

export const fileDoc: GalleryImageDoc = {
  id: 'id123',
  isForSell: true,
  price: 50,
  description: { en: 'This is a description' },
  category: 'acryl',
  name: 'i-201.jpg',
  size: { width: 100, height: 100 },
};

export const fileDocs: GalleryImageDoc[] = [
  {
    category: 'acryl',
    name: 'foo.jpg',
    id: 'id124',
    isForSell: true,
    price: 50,
    description: { en: 'This is a description' },
    size: { width: 100, height: 100 },
  },
  {
    category: 'oil',
    name: 'bar.jpg',
    id: 'id125',
    isForSell: true,
    price: 50,
    description: { en: 'This is a description' },
    size: { width: 100, height: 100 },
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
    size: { width: 100, height: 100 },
  },
  {
    name: 'bar.jpg',
    category: 'oil',
    url: `${BASE_URL}/files/oil/bar.jpg`,
    isForSell: true,
    id: 'id125',
    price: 50,
    description: { en: 'This is a description' },
    size: { width: 100, height: 100 },
  },
];
