import { compare, hash } from 'bcrypt';
import HttpStatus from '../../common/constants/HttpStatus';
import { Role } from '../../common/interface/Constants';
import { LoginDto, RegisterDto } from '../../common/interface/Dto';
import { SALT_ROUNDS } from '../../config';
import { User, UserDoc } from '../model/User';
import { RefreshTokenData } from '../types/Auth';
import { handleHttpErrors } from '../utils/HttpErrorHandler';
import { tryToExecute } from '../utils/HttpErrors';
import { makeHttpResponse } from '../utils/HttpResponses';
import { sendVerificationLink } from './Email';
import { generateAccessToken, updateRefreshToken } from './Token';

const isUserNotExisting = async ({ email, password }: RegisterDto) =>
  tryToExecute<RegisterDto>({
    fnToTry: async () => await User.findOne({ email }).exec(),
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
  roles,
}: RefreshTokenData & { roles: Role[] }) => {
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
      {
        name: 'refreshToken',
        val: refreshToken,
        options: {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        },
      },
    ],
    data: { user: { email, roles } },
  });
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
  return User.create({ email, passwordHash, roles: ['RegisteredUser'] });
};

const register = async ({ email, password }: RegisterDto) =>
  isUserNotExisting({ email, password })
    .then(createNewUser)
    .then(() => sendVerificationLink(email))
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
