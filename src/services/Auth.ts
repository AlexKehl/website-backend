import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRATION_TIME,
  REFRESH_TOKEN_SECRET,
  SALT_ROUNDS,
} from '../../config';
import { User, UserDoc } from '../model/User';
import { LoginDto, RefreshTokenDto, RegisterDto } from '../types';
import { tryToExecute } from '../utils/HttpErrors';
import { handleHttpErrors } from '../utils/HttpErrorHandler';
import { makeHttpResponse } from '../utils/HttpResponses';
import HttpStatus from '../utils/HttpStatus';
import { logger } from '../utils/Logger';
import WithPayloadError from '../utils/Exceptions/WithPayloadError';

const generateAccessToken = ({ email }: { email: string }) =>
  sign({ email }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
  });

const generateRefreshToken = ({ email }: { email: string }) =>
  sign({ email }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
  });

const isUserNotExisting = async ({ email, password }: RegisterDto) =>
  tryToExecute<RegisterDto>({
    fnToTry: async () => !(await User.findOne({ email }).exec()),
    httpErrorData: {
      statusCode: HttpStatus.CONFLICT,
      data: {
        error: 'User exists',
      },
    },
    passThrough: { email, password },
  });

const getUserByMail = async (email: string): Promise<UserDoc> =>
  tryToExecute<UserDoc>({
    fnToTry: () => User.findOne({ email }).exec(),
    httpErrorData: {
      statusCode: HttpStatus.NOT_FOUND,
      data: {
        error: 'User not found',
      },
    },
  });

const hasValidCredentials = (loginDto: LoginDto) => async (user: UserDoc) =>
  tryToExecute<UserDoc>({
    fnToTry: () => compare(loginDto.password, user.passwordHash),
    passThrough: user,
    httpErrorData: {
      statusCode: HttpStatus.UNAUTHORIZED,
      data: { error: 'Invalid Credentials' },
    },
  });

const createLoginSuccessResponse = ({
  email,
  refreshToken,
}: RefreshTokenDto) => {
  const accessToken = generateAccessToken({ email });
  return makeHttpResponse({
    statusCode: HttpStatus.OK,
    cookies: [
      {
        name: 'accessToken',
        val: accessToken,
        options: {
          sameSite: true,
          secure: true,
        },
      },
      {
        name: 'refreshToken',
        val: refreshToken,
        options: {
          sameSite: true,
          secure: true,
        },
      },
    ],
    data: { user: { email } },
  });
};

const updateRefreshToken = async ({
  email,
}: UserDoc): Promise<RefreshTokenDto> => {
  try {
    const refreshToken = generateRefreshToken({ email });
    const refreshTokenHash = await hash(refreshToken, SALT_ROUNDS);
    await User.updateOne({ email }, { refreshTokenHash });
    return { email, refreshToken };
  } catch (e) {
    logger.log({ level: 'error', message: e.message });
    throw new WithPayloadError({
      data: { error: 'Error updating Refresh token' },
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

const deleteRefreshToken = ({ email }: UserDoc) =>
  tryToExecute({
    fnToTry: async () =>
      await User.updateOne({ email }, { $unset: { refreshTokenHash: '' } }),
    httpErrorData: {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      data: { error: 'Error when deleting refresh token' },
    },
  });

const login = async (loginDto: LoginDto) =>
  getUserByMail(loginDto.email)
    .then(hasValidCredentials(loginDto))
    .then(updateRefreshToken)
    .then(createLoginSuccessResponse)
    .catch(handleHttpErrors);

const createNewUser = async ({ email, password }: RegisterDto) => {
  const passwordHash = await hash(password, SALT_ROUNDS);
  return new User({ email, passwordHash });
};

const register = async ({ email, password }: RegisterDto) =>
  isUserNotExisting({ email, password })
    .then(createNewUser)
    .then((user) => user.save())
    .then(() => makeHttpResponse({ statusCode: HttpStatus.CREATED }))
    .catch(handleHttpErrors);

const logout = async (email: string) => {
  return getUserByMail(email)
    .then(deleteRefreshToken)
    .then(() => makeHttpResponse({ statusCode: HttpStatus.OK }))
    .catch(handleHttpErrors);
};

export {
  hasValidCredentials,
  login,
  register,
  createLoginSuccessResponse,
  createNewUser,
  logout,
};
