import { login, register } from '../services/Auth';
import { LoginDto, ExpressObj } from '../types';

const registerController = async ({ req, res }: ExpressObj<LoginDto>) => {
  const { headers, statusCode, data } = await register(req.body);
  res.set(headers).status(statusCode).send(data);
};

const loginController = async ({ req, res }: ExpressObj<LoginDto>) => {
  const { headers, statusCode, data } = await login(req.body);
  res.set(headers).status(statusCode).send(data);

  // res.cookie('refreshToken', refreshToken, {
  //   sameSite: true,
  //   httpOnly: true,
  // });
  // res.cookie('accessToken', accessToken, {
  //   httpOnly: true,
  //   sameSite: true,
  // });
  // res.cookie('hasActiveToken', true);
};

export { registerController, loginController };
