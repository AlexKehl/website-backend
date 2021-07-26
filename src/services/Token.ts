import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  ACCESS_TOKEN_SECRET,
} from '../../config';
import UserModel from '../model/User';
import { RefreshTokenDto } from '../types';
import { makeHttpError } from '../utils/HttpError';
import { makeHttpResponse } from '../utils/HttpResponse';
import HttpStatus from '../utils/HttpStatus';

const getNewAccessToken = async ({ email, refreshToken }: RefreshTokenDto) => {
  const { refreshTokenHash } = (await UserModel.findOne({ email })) || {};
  if (!refreshTokenHash) {
    return makeHttpError({
      statusCode: HttpStatus.NOT_FOUND,
      data: {
        error: 'No refreshToken stored',
      },
    });
  }
  console.log(refreshToken);
  console.log(refreshTokenHash);

  if (!(await compare(refreshToken, refreshTokenHash))) {
    return makeHttpError({
      statusCode: HttpStatus.UNAUTHORIZED,
      data: {
        error: 'Invalid refreshToken',
      },
    });
  }
  return makeHttpResponse({
    statusCode: 200,
    data: {
      accessToken: sign({ email }, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
      }),
    },
  });
};

export { getNewAccessToken };
