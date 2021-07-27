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
import { LoginDto, RegisterDto } from '../types';
import { tryToExecute } from '../utils/HttpErrors';
import { handleHttpErrors } from '../utils/HttpErrorHandler';
import { makeHttpResponse } from '../utils/HttpResponses';
import HttpStatus from '../utils/HttpStatus';

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
  tryToExecute<LoginDto>({
    fnToTry: () => compare(loginDto.password, user.passwordHash),
    passThrough: loginDto,
    httpErrorData: {
      statusCode: HttpStatus.UNAUTHORIZED,
      data: { error: 'Invalid Credentials' },
    },
  });

const createLoginSuccessResponse = ({ email }: LoginDto) => {
  const accessToken = generateAccessToken({ email });
  const refreshToken = generateRefreshToken({ email });
  return makeHttpResponse({
    statusCode: HttpStatus.OK,
    data: { accessToken, refreshToken },
  });
};

const login = async (loginDto: LoginDto) =>
  getUserByMail(loginDto.email)
    .then(hasValidCredentials(loginDto))
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

export {
  hasValidCredentials,
  login,
  register,
  createLoginSuccessResponse,
  createNewUser,
};
