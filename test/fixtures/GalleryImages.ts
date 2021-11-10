import { GalleryImageDoc } from '../../src/model/GalleryImage';

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
