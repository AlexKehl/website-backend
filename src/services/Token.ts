import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  ACCESS_TOKEN_SECRET,
} from '../../config';
import { User } from '../model/User';
import { RefreshTokenDto } from '../types';
import { makeHttpError } from '../utils/HttpErrors';
import { makeHttpResponse } from '../utils/HttpResponses';
import HttpStatus from '../utils/HttpStatus';

interface EvaluateRefreshTokenInput extends RefreshTokenDto {
  refreshTokenHash?: string;
}

const getNewAccessToken = async ({ email, refreshToken }: RefreshTokenDto) => {
  const { refreshTokenHash } = (await User.findOne({ email })) || {};
  return evaluateRefreshToken({ email, refreshToken, refreshTokenHash });
};

const evaluateRefreshToken = async ({
  email,
  refreshToken,
  refreshTokenHash,
}: EvaluateRefreshTokenInput) => {
  if (!refreshTokenHash) {
    return makeHttpError({
      statusCode: HttpStatus.NOT_FOUND,
      data: {
        error: 'No refreshToken stored',
      },
    });
  }

  if (!(await compare(refreshToken, refreshTokenHash))) {
    return makeHttpError({
      statusCode: HttpStatus.UNAUTHORIZED,
      data: {
        error: 'Invalid refreshToken',
      },
    });
  }
  return makeHttpResponse({
    statusCode: HttpStatus.OK,
    data: {
      accessToken: sign({ email }, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
      }),
    },
  });
};

export { getNewAccessToken, evaluateRefreshToken };
