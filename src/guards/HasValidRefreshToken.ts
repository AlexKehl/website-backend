import { compare } from 'bcrypt';
import { decode, verify } from 'jsonwebtoken';
import { REFRESH_TOKEN_SECRET } from '../../config';
import { User } from '../model/User';
import { ExpressObj } from '../types';
import WithPayloadError from '../utils/Exceptions/WithPayloadError';
import HttpStatus from '../../common/constants/HttpStatus';

const hasValidRefreshToken = async (expressObj: ExpressObj) => {
  try {
    const refreshToken = expressObj.req.cookies.refreshToken;
    const decoded = decode(refreshToken, {
      json: true,
    });
    if (!decoded?.email) {
      throw new Error();
    }
    verify(refreshToken || '', REFRESH_TOKEN_SECRET);

    const user = await User.findOne({ email: decoded.email }).exec();
    const isValid = await compare(refreshToken, user?._refreshTokenHash || '');

    if (!isValid) {
      throw new Error();
    }

    return expressObj;
  } catch (e) {
    throw new WithPayloadError({
      statusCode: HttpStatus.UNAUTHORIZED,
      data: {
        error: 'Invalid refresh token',
      },
    });
  }
};

export { hasValidRefreshToken };
