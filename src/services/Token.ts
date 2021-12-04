import { sign } from 'jsonwebtoken';
import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  ACCESS_TOKEN_SECRET,
} from '../../config';
import { User } from '../../common/interface/ConsumerResponses';

const generateAccessToken = (user: Pick<User, 'email' | 'roles'>) =>
  sign({ ...user, iat: new Date().getTime() }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
  });

export { generateAccessToken };
