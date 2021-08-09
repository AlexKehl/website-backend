import { login, logout, register } from '../services/Auth';
import { ExpressObj } from '../types';
import { evaluateHttpObject } from '../utils/HttpResponses';
import { getEmailFromToken } from '../utils/Tokens';
import { LoginDto } from '../../common/interface/Dto';

const registerController = async ({ req, res }: ExpressObj<LoginDto>) => {
  evaluateHttpObject(res, await register(req.body));
};

const loginController = async ({ req, res }: ExpressObj<LoginDto>) => {
  evaluateHttpObject(res, await login(req.body));
};

const logoutController = async ({ req, res }: ExpressObj) => {
  const { refreshToken } = req.cookies;
  const email = getEmailFromToken(refreshToken);

  evaluateHttpObject(res, await logout(email));
};

export { registerController, loginController, logoutController };
