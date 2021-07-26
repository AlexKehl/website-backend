import { UserDoc } from '../../src/model/User';

export const UserWithPassword = {
  email: 'test@test.com',
  password: '12345678',
};

export const RegisteredUser: UserDoc = {
  email: 'test@test.com',
  passwordHash: '$2b$10$iVjBNmC5NoJoeGVqDM/rw.IkftpSd9jq78t0K7LdJEvNlCyR8atKW',
  refreshTokenHash: 'someToken',
};
