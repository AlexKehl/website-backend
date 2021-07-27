import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRATION_TIME,
  REFRESH_TOKEN_SECRET,
  SALT_ROUNDS,
} from '../../config';
import { User } from '../model/User';
import { Credentials, LoginDto, RegisterDto } from '../types';
import { makeHttpError } from '../utils/HttpError';
import { makeHttpResponse } from '../utils/HttpResponse';
import HttpStatus from '../utils/HttpStatus';
import { logger } from '../utils/Logger';

const generateAccessToken = ({ email }: { email: string }) =>
  sign({ email }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
  });

const generateRefreshToken = ({ email }: { email: string }) =>
  sign({ email }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
  });

const hasValidCredentials = async ({ email, password }: Credentials) => {
  try {
    const { passwordHash = '' } = (await User.findOne({ email })) || {};

    return await compare(password, passwordHash);
  } catch (e) {
    logger.log({ level: 'info', message: e.message });
    return false;
  }
};

const isUserExisting = async (email: string): Promise<boolean> => {
  return Boolean(await User.findOne({ email }));
};

const login = async ({ email, password }: LoginDto) => {
  if (!(await isUserExisting(email))) {
    return makeHttpError({
      statusCode: HttpStatus.NOT_FOUND,
      data: {
        error: 'User not found',
      },
    });
  }
  if (!(await hasValidCredentials({ email, password }))) {
    return makeHttpError({
      statusCode: HttpStatus.UNAUTHORIZED,
      data: {
        error: 'Invalid Credentials',
      },
    });
  }
  const accessToken = generateAccessToken({ email });
  const refreshToken = generateRefreshToken({ email });
  await User.updateOne(
    { email },
    { refreshTokenHash: await hash(refreshToken, SALT_ROUNDS) }
  );
  return makeHttpResponse({
    statusCode: HttpStatus.OK,
    data: { accessToken, refreshToken },
  });
};

const register = async ({ email, password }: RegisterDto) => {
  if (await isUserExisting(email)) {
    return makeHttpError({
      statusCode: HttpStatus.CONFLICT,
      data: {
        error: 'User exists',
      },
    });
  }
  const passwordHash = await hash(password, SALT_ROUNDS);
  const createdUser = new User({ email, passwordHash });
  await createdUser.save();
  return makeHttpResponse({ statusCode: HttpStatus.CREATED });
};

export { hasValidCredentials, login, register };
