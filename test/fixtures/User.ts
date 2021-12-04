import { sign } from 'jsonwebtoken';
import { addressDto, contactDto } from '../../common/fixtures/Dto';
import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  ACCESS_TOKEN_SECRET,
} from '../../config';
import { UserDoc } from '../../src/model/User';

const USER_EMAIL = 'user@test.com';

export const generateAccessToken = async (email: string) => {
  const accessToken = sign({ email }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
  });
  return accessToken;
};

export const AdminUser: UserDoc = {
  email: USER_EMAIL,
  _passwordHash: '$2b$10$iVjBNmC5NoJoeGVqDM/rw.IkftpSd9jq78t0K7LdJEvNlCyR8atKW',
  roles: ['Admin'],
  contact: contactDto,
  address: addressDto,
  _isEmailConfirmed: true,
};

export const RegisteredUser: UserDoc = {
  email: USER_EMAIL,
  _passwordHash: '$2b$10$iVjBNmC5NoJoeGVqDM/rw.IkftpSd9jq78t0K7LdJEvNlCyR8atKW',
  roles: ['RegisteredUser'],
  _isEmailConfirmed: true,
  contact: contactDto,
  address: addressDto,
};
