import { OrderImageDto, WithBody } from '../types';
import { serializeFileObjects } from './Files';

const getImagesForUser = async (userId: string) => {
  return;
};

const orderImageSync = async (req: WithBody<OrderImageDto>) => {
  return Promise.resolve(serializeFileObjects<OrderImageDto>(req));
};

export { orderImageSync };
