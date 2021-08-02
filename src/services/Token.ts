import { sign } from 'jsonwebtoken';
import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  ACCESS_TOKEN_SECRET,
} from '../../config';
import { makeHttpResponse } from '../utils/HttpResponses';
import HttpStatus from '../utils/HttpStatus';
import { getEmailFromToken } from '../utils/Tokens';

const getNewAccessToken = (refreshToken: string) => {
  const email = getEmailFromToken(refreshToken);
  return makeHttpResponse({
    statusCode: HttpStatus.OK,
    cookies: [
      {
        val: sign({ email, iat: new Date().getTime() }, ACCESS_TOKEN_SECRET, {
          expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
        }),
        name: 'accessToken',
        options: {
          sameSite: true,
          secure: true,
        },
      },
    ],
  });
};

export { getNewAccessToken };
