import { decode } from 'jsonwebtoken';
import HttpStatus from '../../common/constants/HttpStatus';
import WithPayloadError from './Exceptions/WithPayloadError';

export const getEmailFromToken = (token: string): string => {
  const decoded = decode(token, { json: true });
  if (!decoded?.email) {
    throw new WithPayloadError({
      data: { error: 'Invalid token' },
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }
  return decoded.email;
};
