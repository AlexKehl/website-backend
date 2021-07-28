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
    category: 'Acryl',
    name: 'foo.jpg',
  },
  {
    category: 'Oil',
    name: 'bar.jpg',
  },
];

export const imagesForConsumer: ImageForConsumer[] = [
  {
    name: 'foo.jpg',
    category: 'Acryl',
    url: `${BASE_URL}/files/image/Acryl/foo.jpg`,
  },
  {
    name: 'bar.jpg',
    category: 'Oil',
    url: `${BASE_URL}/files/image/Oil/bar.jpg`,
  },
];
