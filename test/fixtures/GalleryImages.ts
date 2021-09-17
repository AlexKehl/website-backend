import { ImageForGallery } from '../../common/interface/ConsumerData';
import { GalleryImageDto } from '../../common/interface/Dto';
import { BASE_URL } from '../../config';
import { GalleryImageDoc } from '../../src/model/GalleryImage';

export const galleryImageDto: GalleryImageDto = {
  id: 'someId',
  isForSell: true,
  description: 'This is a description',
  name: 'i-201.jpg',
  image: 'someBase64EncodedImage',
  width: 100,
  height: 100,
  category: 'acryl',
  price: 150,
};

export const galleryImageDoc: GalleryImageDoc = {
  id: 'id123',
  isForSell: true,
  price: 50,
  description: 'This is a description',
  category: 'acryl',
  name: 'i-201.jpg',
  width: 100,
  height: 100,
};

export const galleryImageDocs: GalleryImageDoc[] = [
  {
    category: 'acryl',
    name: 'foo.jpg',
    id: 'id124',
    isForSell: true,
    price: 50,
    description: 'This is a description',
    width: 100,
    height: 100,
  },
  {
    category: 'oil',
    name: 'bar.jpg',
    id: 'id125',
    isForSell: true,
    price: 50,
    description: 'This is a description',
    width: 100,
    height: 100,
  },
];

export const imagesForGallery: ImageForGallery[] = [
  {
    name: 'foo.jpg',
    category: 'acryl',
    url: `/files/acryl/id124`,
    isForSell: true,
    id: 'id124',
    price: 50,
    description: 'This is a description',
    width: 100,
    height: 100,
  },
  {
    name: 'bar.jpg',
    category: 'oil',
    url: `/files/oil/id125`,
    isForSell: true,
    id: 'id125',
    price: 50,
    description: 'This is a description',
    width: 100,
    height: 100,
  },
];
