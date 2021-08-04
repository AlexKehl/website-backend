import { orderImageSync } from '../services/Profile';
import { ExpressObj, OrderImageDto } from '../types';
import { evaluateHttpObject } from '../utils/HttpResponses';

const orderImageSyncController = async ({
  req,
  res,
}: ExpressObj<OrderImageDto>) => {
  const serviceResponse = await orderImageSync(req);
  // evaluateHttpObject(res, serviceResponse);
};

export { orderImageSyncController };
