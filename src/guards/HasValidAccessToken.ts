import { verify } from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../../config';
import { ExpressObj } from '../types';
import WithPayloadError from '../utils/Exceptions/WithPayloadError';
import { makeHttpError } from '../utils/HttpError';
import HttpStatus from '../utils/HttpStatus';

const getAccessTokenFromHeader = ({
  authorization,
}: { authorization?: string } = {}) =>
  authorization && authorization.split(' ')[1];

const hasValidAccessToken = async (expressObj: ExpressObj) => {
  const token = getAccessTokenFromHeader(expressObj.req.headers);

  try {
    verify(token || '', ACCESS_TOKEN_SECRET);
    return expressObj;
  } catch (e) {
    throw new WithPayloadError({
      message: 'Invalid token',
      payload: makeHttpError({
        statusCode: HttpStatus.UNAUTHORIZED,
        data: {
          error: 'Invalid accessToken',
        },
      }),
    });
  }
};

export { getAccessTokenFromHeader, hasValidAccessToken };
