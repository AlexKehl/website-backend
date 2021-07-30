import { login, logout, register } from '../services/Auth';
import { LoginDto, ExpressObj, LogoutDto } from '../types';

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

const logoutController = async ({ req, res }: ExpressObj<LogoutDto>) => {
  const { refreshToken } = req.cookies;
  const { email } = req.body;
  const { headers, statusCode, data } = await logout(email, refreshToken);
  res.set(headers).status(statusCode).send(data);
};

export { registerController, loginController, logoutController };
