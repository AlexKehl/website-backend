import { getNewAccessToken } from '../services/Token';
import { ExpressObj } from '../types';
import { evaluateHttpObject } from '../utils/HttpResponses';

const getNewAccessTokenController = async ({ req, res }: ExpressObj) => {
  const { refreshToken } = req.cookies;

  evaluateHttpObject(res, getNewAccessToken(refreshToken));
};

export { getNewAccessTokenController };
