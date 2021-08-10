import { login, logout, register } from '../services/Auth';
import { Controller } from '../types';
import { evaluateHttpObject } from '../utils/HttpResponses';
import { getEmailFromToken } from '../utils/Tokens';
import { LoginDto } from '../../common/interface/Dto';

const registerController: Controller<LoginDto> = async ({ req, res }) => {
  evaluateHttpObject(res, await register(req.body));
};

const loginController: Controller<LoginDto> = async ({ req, res }) => {
  evaluateHttpObject(res, await login(req.body));
};

const logoutController: Controller = async ({ req, res }) => {
  const { refreshToken } = req.cookies;
  const email = getEmailFromToken(refreshToken);

  evaluateHttpObject(res, await logout(email));
};

export { registerController, loginController, logoutController };
