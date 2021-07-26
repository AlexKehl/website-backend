import { getNewAccessToken } from '../services/Token';
import { ExpressObj, RefreshTokenDto } from '../types';

const getNewAccessTokenController = async ({
  req,
  res,
}: ExpressObj<RefreshTokenDto>) => {
  const { headers, statusCode, data } = await getNewAccessToken(req.body);
  res.set(headers).status(statusCode).send(data);
};

export { getNewAccessTokenController };
