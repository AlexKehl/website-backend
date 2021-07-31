import { getNewAccessToken } from '../services/Token';
import { EmailDto, ExpressObj } from '../types';

const getNewAccessTokenController = async ({
  req,
  res,
}: ExpressObj<EmailDto>) => {
  const { refreshToken } = req.cookies;
  const { headers, statusCode, data } = await getNewAccessToken(refreshToken);
  res.cookie('accessToken', data?.accessToken, {
    sameSite: true,
    secure: true,
  });
  res.set(headers).status(statusCode).send(data);
};

export { getNewAccessTokenController };
