import { compare, hash } from 'bcrypt';
import HttpStatus from '../../common/constants/HttpStatus';
import { LoginDto, RegisterDto } from '../../common/interface/Dto';
import { SALT_ROUNDS } from '../../config';
import { User, UserDoc } from '../model/User';
import { omitPrivateFields } from '../utils/Functions';
import { handleHttpErrors } from '../utils/HttpErrorHandler';
import { tryToExecute } from '../utils/HttpErrors';
import { makeHttpResponse } from '../utils/HttpResponses';
import { sendVerificationLink } from './Email';
import { generateAccessToken } from './Token';
import { findUser } from './Users';

const isUserNotExisting = async ({ email, password }: RegisterDto) =>
  tryToExecute<RegisterDto>({
    fnToTry: () => findUser(email),
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
    fnToTry: () => findUser(email),
    httpErrorData: {
      statusCode: HttpStatus.NOT_FOUND,
      data: {
        error: 'User not found',
      },
    },
  });

const hasValidCredentials = (loginDto: LoginDto) => async (user: UserDoc) =>
  tryToExecute<UserDoc>({
    fnToTry: () => compare(loginDto.password, user._passwordHash),
    passThrough: user,
    httpErrorData: {
      statusCode: HttpStatus.UNAUTHORIZED,
      data: { error: 'Invalid Credentials' },
    },
  });

const createLoginSuccessResponse = (user: UserDoc) => {
  const { email, roles } = user;
  const accessToken = generateAccessToken({ email, roles });
  return makeHttpResponse({
    statusCode: HttpStatus.OK,
    cookies: [
      {
        name: 'accessToken',
        val: accessToken,
        options: {
          sameSite: 'none',
          secure: true,
        },
      },
    ],
    data: {
      accessToken,
      user: omitPrivateFields(user),
    },
  });
};

const login = async (loginDto: LoginDto) =>
  getUserByMail(loginDto.email)
    .then(hasValidCredentials(loginDto))
    .then(createLoginSuccessResponse)
    .catch(handleHttpErrors);

const createNewUser = async ({ email, password }: RegisterDto) => {
  const passwordHash = await hash(password, SALT_ROUNDS);
  return User.create({ email, passwordHash, roles: ['RegisteredUser'] });
};

const register = async ({ email, password }: RegisterDto) =>
  isUserNotExisting({ email, password })
    .then(createNewUser)
    .then(() => sendVerificationLink(email))
    .then(() => makeHttpResponse({ statusCode: HttpStatus.CREATED }))
    .catch(handleHttpErrors);

export {
  hasValidCredentials,
  login,
  register,
  createLoginSuccessResponse,
  createNewUser,
};
