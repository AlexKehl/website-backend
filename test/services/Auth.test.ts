import {
  createLoginSuccessResponse,
  createNewUser,
  hasValidCredentials,
} from '../../src/services/Auth';
import { makeHttpResponse } from '../../src/utils/HttpResponses';
import HttpStatus from '../../src/utils/HttpStatus';
import {
  getUserWithRefreshToken,
  RegisteredUser,
  userResponse,
  UserWithPassword,
} from '../fixtures/User';
import WithPayloadError from '../../src/utils/Exceptions/WithPayloadError';
import { verify } from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../../config';

describe('createNewUser', () => {
  it('creates a new user with hashed password', async () => {
    const { passwordHash } = await createNewUser(UserWithPassword);

    expect(passwordHash).toEqual(expect.any(String));
  });
});

describe('hasValidCredentials', () => {
  it('resolves with loginDto if credentials are valid', async () => {
    const res = await hasValidCredentials(UserWithPassword)(RegisteredUser);
    expect(res).toEqual(RegisteredUser);
  });

  it('rejects for invalid credentials', async () => {
    const { email } = UserWithPassword;
    const invalidCredentials = { email, password: 'foobarxy' };

    await expect(
      hasValidCredentials(invalidCredentials)(RegisteredUser)
    ).rejects.toEqual(
      new WithPayloadError({
        statusCode: HttpStatus.UNAUTHORIZED,
        data: {
          error: 'Invalid Credentials',
        },
      })
    );
  });
});

describe('createLoginSuccessResponse', () => {
  it('returns http res with tokens and userResponse', async () => {
    const userWithRefreshToken = await getUserWithRefreshToken();
    const res = createLoginSuccessResponse(userWithRefreshToken);

    const expected = makeHttpResponse({
      statusCode: HttpStatus.OK,
      cookies: [
        {
          name: 'accessToken',
          val: expect.any(String),
          options: {
            sameSite: true,
            secure: true,
          },
        },
        {
          name: 'refreshToken',
          val: expect.any(String),
          options: {
            sameSite: true,
            secure: true,
          },
        },
      ],
      data: {
        user: userResponse,
      },
    });

    expect(res).toEqual(expected);
    expect(verify(res.cookies[0].val, ACCESS_TOKEN_SECRET)).toBeDefined();
    expect(verify(res.cookies[1].val, REFRESH_TOKEN_SECRET)).toBeDefined();
  });
});
