import { decode, verify } from 'jsonwebtoken';
import { REFRESH_TOKEN_SECRET } from '../../config';
import { ExpressObj, RefreshTokenDto } from '../types';
import WithPayloadError from '../utils/Exceptions/WithPayloadError';
import HttpStatus from '../utils/HttpStatus';

const hasValidRefreshToken = async (
  expressObj: ExpressObj<RefreshTokenDto>
) => {
  try {
    const decoded = decode(expressObj.req.cookies.refreshToken, {
      json: true,
    });
    if (!decoded?.email) {
      throw new Error();
    }
    verify(expressObj.req.cookies.refreshToken || '', REFRESH_TOKEN_SECRET);
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
