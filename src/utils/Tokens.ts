import { decode } from 'jsonwebtoken';
import HttpStatus from '../../common/constants/HttpStatus';
import { User } from '../../common/interface/ConsumerResponses';
import WithPayloadError from './Exceptions/WithPayloadError';

export const getUserFromToken = (token: string): User => {
  const { email, roles } = decode(token, { json: true }) || {};
  if (!email) {
    throw new WithPayloadError({
      data: { error: 'Invalid token' },
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }
  return { email, roles };
};
