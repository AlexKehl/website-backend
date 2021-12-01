import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { addressDto, contactDto } from '../../common/fixtures/Dto';
import {
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRATION_TIME,
  SALT_ROUNDS,
  ACCESS_TOKEN_EXPIRATION_TIME,
  ACCESS_TOKEN_SECRET,
} from '../../config';
import { UserDoc } from '../../src/model/User';
import { RefreshTokenData } from '../../src/types/Auth';

const USER_EMAIL = 'user@test.com';

export const generateAccessToken = async (email: string) => {
  const accessToken = sign({ email }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
  });
  return accessToken;
};

export const generateRefreshTokenAndHash = async (email: string) => {
  const refreshToken = sign({ email }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
  });
  const refreshTokenHash = await hash(refreshToken, SALT_ROUNDS);
  return {
    refreshToken,
    refreshTokenHash,
  };
};

export const getUserWithRefreshToken = async () => {
  const { refreshToken } = await generateRefreshTokenAndHash(USER_EMAIL);
  return {
    email: USER_EMAIL,
    refreshToken: refreshToken,
  };
};

export const UserWithRefreshToken: RefreshTokenData = {
  email: USER_EMAIL,
  refreshToken: 'someToken',
};

export const AdminUser: UserDoc = {
  email: USER_EMAIL,
  passwordHash: '$2b$10$iVjBNmC5NoJoeGVqDM/rw.IkftpSd9jq78t0K7LdJEvNlCyR8atKW',
  refreshTokenHash:
    '$2b$10$gS6mgtoUKtRBpVVyea7zCO9kPfDP5.W6j3AQPZHEqhJ2LoEopzGVq',
  roles: ['Admin'],
  contact: contactDto,
  address: addressDto,
  isEmailConfirmed: true,
};

export const RegisteredUser: UserDoc = {
  email: USER_EMAIL,
  passwordHash: '$2b$10$iVjBNmC5NoJoeGVqDM/rw.IkftpSd9jq78t0K7LdJEvNlCyR8atKW',
  refreshTokenHash:
    '$2b$10$gS6mgtoUKtRBpVVyea7zCO9kPfDP5.W6j3AQPZHEqhJ2LoEopzGVq',
  roles: ['RegisteredUser'],
  isEmailConfirmed: true,
  contact: contactDto,
  address: addressDto,
};
