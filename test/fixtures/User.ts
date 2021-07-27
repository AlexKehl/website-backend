import { UserDoc } from '../../src/model/User';
import { LoginDto, RefreshTokenDto } from '../../src/types';

export const UserWithPassword: LoginDto = {
  email: 'test@test.com',
  password: '12345678',
};

export const UserWithRefreshToken: RefreshTokenDto = {
  email: 'test@test.com',
  refreshToken: 'someToken',
};

export const RegisteredUser: UserDoc = {
  email: 'test@test.com',
  passwordHash: '$2b$10$iVjBNmC5NoJoeGVqDM/rw.IkftpSd9jq78t0K7LdJEvNlCyR8atKW',
  refreshTokenHash:
    '$2b$10$gS6mgtoUKtRBpVVyea7zCO9kPfDP5.W6j3AQPZHEqhJ2LoEopzGVq',
};
