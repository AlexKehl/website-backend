import { login, logout, register } from '../services/Auth';
import { LoginDto, ExpressObj } from '../types';
import { getEmailFromToken } from '../utils/Tokens';

const registerController = async ({ req, res }: ExpressObj<LoginDto>) => {
  const { headers, statusCode, data } = await register(req.body);
  res.set(headers).status(statusCode).send(data);
};

const loginController = async ({ req, res }: ExpressObj<LoginDto>) => {
  const { headers, statusCode, data } = await login(req.body);
  res.cookie('refreshToken', data?.refreshToken, {
    httpOnly: true,
    secure: true,
  });
  res.cookie('accessToken', data?.accessToken, {
    sameSite: true,
    secure: true,
  });
  res.set(headers).status(statusCode).send(data);
};

const logoutController = async ({ req, res }: ExpressObj) => {
  const { refreshToken } = req.cookies;
  const email = getEmailFromToken(refreshToken);
  const { headers, statusCode, data } = await logout(email);
  res.set(headers).status(statusCode).send(data);
};

export { registerController, loginController, logoutController };
