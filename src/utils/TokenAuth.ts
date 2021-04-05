import jwt from 'jsonwebtoken';
import { BLFunction, AdaptedRequest } from '../types';
import { makeHttpError } from './HttpError';

const getAccessTokenFromHeader = ({
  authorization,
}: { authorization?: string } = {}) =>
  authorization && authorization.split(' ')[1];

const withTokenAuth = (fn: BLFunction) => (
  requestData: AdaptedRequest<any>
) => {
  const token = getAccessTokenFromHeader(requestData.headers);
  try {
    jwt.verify(token || '', process.env.ACCESS_TOKEN_SECRET);
    return fn(requestData);
  } catch (e) {
    return makeHttpError({
      statusCode: 403,
      error: 'Invalid accessToken ',
    });
  }
};

export { getAccessTokenFromHeader, withTokenAuth };
