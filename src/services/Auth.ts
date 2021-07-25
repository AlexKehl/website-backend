import { compare, hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  SALT_ROUNDS,
} from '../../config';
import { Credentials, Login, LoginDto, RegisterDto } from '../types';
import { makeHttpError } from '../utils/HttpError';
import { makeHttpResponse } from '../utils/HttpResponse';
import UserModel from '../model/User';
import HttpStatus from '../utils/HttpStatus';

const generateAccessToken = ({ email }: { email: string }) =>
  sign({ email }, ACCESS_TOKEN_SECRET, { expiresIn: '45s' });

const generateRefreshToken = ({ email }: { email: string }) =>
  sign({ email }, REFRESH_TOKEN_SECRET);

const hasValidCredentials = async ({ email, password }: Credentials) => {
  try {
    const { passwordHash = '' } = (await UserModel.findOne({ email })) || {};
    return await compare(password, passwordHash);
  } catch (e) {
    console.log(e);
    return false;
  }
};

const login = async ({ email, password }: LoginDto) => {
  if (!(await hasValidCredentials({ email, password }))) {
    return makeHttpError({
      statusCode: HttpStatus.UNAUTHORIZED,
      error: 'Invalid Credentials',
    });
  }
  const accessToken = generateAccessToken({ email });
  const refreshToken = generateRefreshToken({ email });
  await UserModel.updateOne({ email }, { refreshToken });
  return makeHttpResponse({
    statusCode: HttpStatus.OK,
    data: { accessToken, refreshToken },
  });
};

const isUserExisting = async (email: string): Promise<boolean> => {
  return Boolean(await UserModel.findOne({ email }));
};

const register = async ({ email, password }: RegisterDto) => {
  if (await isUserExisting(email)) {
    return makeHttpError({
      statusCode: HttpStatus.CONFLICT,
      error: 'User exists',
    });
  }
  const passwordHash = await hash(password, SALT_ROUNDS);
  const createdUser = new UserModel({ email, passwordHash });
  await createdUser.save();
  return makeHttpResponse({ statusCode: HttpStatus.CREATED });
};

const refreshAccessToken = async ({ body }: Pick<Login, 'body'>) => {
  const { email, refreshToken } = body;
  const user = await UserModel.findOne({ email });
  if (!user?.refreshToken) {
    return makeHttpError({ statusCode: 401, error: 'No refreshToken stored' });
  }
  if (refreshToken !== user.refreshToken) {
    return makeHttpError({ statusCode: 403, error: 'Invalid refreshToken' });
  }
  try {
    verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch (e) {
    return makeHttpError({ statusCode: 403, error: 'Invalid refreshToken' });
  }
  return makeHttpResponse({
    statusCode: 200,
    data: { accessToken: generateAccessToken({ email }) },
  });
};

export { hasValidCredentials, login, refreshAccessToken, register };
