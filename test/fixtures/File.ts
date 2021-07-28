import { BASE_URL } from '../../config';
import { FileDoc } from '../../src/model/File';
import { ImageForConsumer, SerializedFileObj } from '../../src/types';

export const serializedFileObj: SerializedFileObj = {
  originalname: 'i-201.jpg',
  mimetype: 'image/jpeg',
  buffer: Buffer.from([8, 6, 7, 5, 3, 0, 9]),
  size: 473101,
  category: 'Acryl',
};

export const fileDocs: FileDoc[] = [
  {
    category: 'acryl',
    name: 'foo.jpg',
  },
  {
    category: 'oil',
    name: 'bar.jpg',
  },
];

export const imagesForConsumer: ImageForConsumer[] = [
  {
    name: 'foo.jpg',
    category: 'acryl',
    url: `${BASE_URL}/files/acryl/foo.jpg`,
  },
  {
    name: 'bar.jpg',
    category: 'oil',
    url: `${BASE_URL}/files/oil/bar.jpg`,
  },
];
