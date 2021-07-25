import { verify } from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../../config';
import { ExpressObj } from '../types';
import WithPayloadError from '../utils/Exceptions/WithPayloadError';
import { makeHttpError } from '../utils/HttpError';

const getAccessTokenFromHeader = ({
  authorization,
}: { authorization?: string } = {}) =>
  authorization && authorization.split(' ')[1];

const hasValidToken = async (expressObj: ExpressObj) => {
  const token = getAccessTokenFromHeader(expressObj.req.headers);

  try {
    verify(token || '', ACCESS_TOKEN_SECRET);
    return expressObj;
  } catch (e) {
    throw new WithPayloadError({
      message: 'Invalid token',
      payload: makeHttpError({
        statusCode: 403,
        error: 'Invalid accessToken ',
      }),
    });
  }
};

export { getAccessTokenFromHeader, hasValidToken };
