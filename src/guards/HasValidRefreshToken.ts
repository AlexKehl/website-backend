import { verify } from 'jsonwebtoken';
import { REFRESH_TOKEN_SECRET } from '../../config';
import { ExpressObj, RefreshTokenDto } from '../types';
import WithPayloadError from '../utils/Exceptions/WithPayloadError';
import { makeHttpError } from '../utils/HttpError';
import HttpStatus from '../utils/HttpStatus';

const hasValidRefreshToken = async (
  expressObj: ExpressObj<RefreshTokenDto>
) => {
  try {
    verify(expressObj.req.body.refreshToken || '', REFRESH_TOKEN_SECRET);
    return expressObj;
  } catch (e) {
    throw new WithPayloadError({
      message: 'Invalid token',
      payload: makeHttpError({
        statusCode: HttpStatus.UNAUTHORIZED,
        data: {
          fromGuard: true,
          error: 'Invalid refreshToken',
        },
      }),
    });
  }
};

export { hasValidRefreshToken };
