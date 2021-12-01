import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Role } from '../../common/interface/Constants';
import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRATION_TIME,
  REFRESH_TOKEN_SECRET,
  SALT_ROUNDS,
} from '../../config';
import { User as UserModel, UserDoc } from '../model/User';
import { RefreshTokenData } from '../types/Auth';
import WithPayloadError from '../utils/Exceptions/WithPayloadError';
import { makeHttpResponse } from '../utils/HttpResponses';
import HttpStatus from '../../common/constants/HttpStatus';
import { logger } from '../utils/Logger';
import { getUserFromToken } from '../utils/Tokens';
import { User } from '../../common/interface/ConsumerResponses';

const generateAccessToken = (user: Pick<User, 'email' | 'roles'>) =>
  sign({ ...user, iat: new Date().getTime() }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
  });

const generateRefreshToken = (user: Pick<User, 'email' | 'roles'>) =>
  sign(user, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
  });

const updateRefreshToken = async (
  userDoc: UserDoc
): Promise<RefreshTokenData & { roles: Role[] }> => {
  const { email, roles } = userDoc;
  try {
    const refreshToken = generateRefreshToken({ email, roles });
    const refreshTokenHash = await hash(refreshToken, SALT_ROUNDS);
    await UserModel.updateOne({ email }, { refreshTokenHash });
    return { email, refreshToken, roles };
  } catch (e) {
    if (e instanceof Error) {
      logger.log({ level: 'error', message: e.message });
    }
    throw new WithPayloadError({
      data: { error: 'Error updating Refresh token' },
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

const getNewAccessToken = (refreshToken: string) => {
  const userData = getUserFromToken(refreshToken);
  return makeHttpResponse({
    statusCode: HttpStatus.OK,
    cookies: [
      {
        val: generateAccessToken(userData),
        name: 'accessToken',
        options: {
          sameSite: true,
          secure: true,
        },
      },
    ],
  });
};

export {
  getNewAccessToken,
  generateAccessToken,
  generateRefreshToken,
  updateRefreshToken,
};
