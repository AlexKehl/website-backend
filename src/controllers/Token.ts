import { getNewAccessToken } from '../services/Token';
import { EmailDto, ExpressObj } from '../types';
import { evaluateHttpObject } from '../utils/HttpResponses';

const getNewAccessTokenController = async ({
  req,
  res,
}: ExpressObj<EmailDto>) => {
  const { refreshToken } = req.cookies;

  evaluateHttpObject(res, await getNewAccessToken(refreshToken));
};

export { getNewAccessTokenController };
