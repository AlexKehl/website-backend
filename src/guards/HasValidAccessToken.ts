import { decode, verify } from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../../config';
import { ExpressObj } from '../types';
import WithPayloadError from '../utils/Exceptions/WithPayloadError';
import HttpStatus from '../utils/HttpStatus';

const hasValidAccessToken = async (expressObj: ExpressObj) => {
  try {
    const decoded = decode(expressObj.req.cookies.accessToken, {
      json: true,
    });
    if (!decoded?.email) {
      throw new Error();
    }
    verify(expressObj.req.cookies.accessToken || '', ACCESS_TOKEN_SECRET);
    return expressObj;
  } catch (e) {
    console.log(e);
    throw new WithPayloadError({
      statusCode: HttpStatus.UNAUTHORIZED,
      data: {
        error: 'Invalid accessToken',
      },
    });
  }
};

export { hasValidAccessToken };
