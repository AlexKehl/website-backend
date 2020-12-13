import { compare } from 'bcrypt';
import { IncomingHttpHeaders } from 'http';
import * as jwt from 'jsonwebtoken';
import UserModel from './model/User';
import { ICredentials } from './types';

const generateAccessToken = ({ email }: { email: string }) =>
  jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '45s' });

const generateRefreshToken = ({ email }: { email: string }) =>
  jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET);

const checkUser = async ({ email, password }: ICredentials) => {
  try {
    const { passwordHash } = await UserModel.findOne({ email });
    return await compare(password, passwordHash);
  } catch (e) {
    return false;
  }
};

const login = async ({ email, password }: ICredentials) => {
  const hasValidCredentials = await checkUser({ email, password });
  if (!hasValidCredentials) {
    throw new Error('http: 401');
  }

  const accessToken = generateAccessToken({ email });
  const refreshToken = generateRefreshToken({ email });
  await UserModel.updateOne({ email }, { refreshToken });
  return { accessToken, refreshToken };
};

const getAccessTokenFromHeader = ({ authorization }: IncomingHttpHeaders) =>
  authorization && authorization.split(' ')[1];

const authenticateToken = (headers: IncomingHttpHeaders) => {
  const token = getAccessTokenFromHeader(headers);
  if (!token) {
    throw new Error('http: 401');
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

const refreshToken = async ({
  email,
  refreshToken,
}: {
  email: string;
  refreshToken: string;
}) => {
  if (!refreshToken) {
    throw new Error('http: 401');
  }
  const userDoc = await UserModel.findOne({ email });
  if (!userDoc.refreshToken) {
    throw new Error('http: 403');
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const accessToken = generateAccessToken({ email });
  return { accessToken };
};

export {
  checkUser,
  login,
  refreshToken,
  authenticateToken,
  getAccessTokenFromHeader,
};
