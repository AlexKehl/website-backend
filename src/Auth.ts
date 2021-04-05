import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from './model/User';
import {Credentials, Login } from './types';
import {makeHttpError} from './utils/HttpError';
import {makeHttpResponse} from './utils/HttpResponse';

const generateAccessToken = ({ email }: {email: string}) =>
  jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '45s' });

const generateRefreshToken = ({ email }: {email: string}) =>
  jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET);

const checkUser = async ({ email, password }: Credentials) => {
  try {
    const { passwordHash = '' } = await UserModel.findOne({ email }) || {};
    return await bcrypt.compare(password, passwordHash);
  } catch (e) {
    return false;
  }
};

const login = async ({ body }: Pick<Login, 'body'>) => {
  const { email, password } = body;
  const hasValidCredentials = await checkUser({ email, password });

  if (!hasValidCredentials) {
    return makeHttpError({
      statusCode: 401,
      error: 'Invalid Credentials',
    });
  }

  const accessToken = generateAccessToken({ email });
  const refreshToken = generateRefreshToken({ email });
  await UserModel.updateOne({ email }, { refreshToken });

  return makeHttpResponse({
    statusCode: 200,
    data: {
      accessToken,
      refreshToken,
    },
  });
};

const refreshToken = async ({ body }: Pick<Login, 'body'>) => {
  const { email, refreshToken } = body;

  const user = await UserModel.findOne({ email });
  console.log(user)

  if (!user?.refreshToken) {
    return makeHttpError({
      statusCode: 401,
      error: 'No refreshToken stored',
    });
  }
  if (refreshToken !== user.refreshToken) {
    return makeHttpError({
      statusCode: 403,
      error: 'Invalid refreshToken',
    });
  }

  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (e) {
    return makeHttpError({
      statusCode: 403,
      error: 'Invalid refreshToken',
    });
  }

  return makeHttpResponse({
    statusCode: 200,
    data: {
      accessToken: generateAccessToken({ email }),
    },
  });
};

export{
  checkUser,
  login,
  refreshToken,
};
