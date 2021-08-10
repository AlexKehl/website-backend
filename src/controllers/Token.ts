import { getNewAccessToken } from '../services/Token';
import { Controller } from '../types';
import { evaluateHttpObject } from '../utils/HttpResponses';

const getNewAccessTokenController: Controller = async ({ req, res }) => {
  const { refreshToken } = req.cookies;

  evaluateHttpObject(res, getNewAccessToken(refreshToken));
};

export { getNewAccessTokenController };
