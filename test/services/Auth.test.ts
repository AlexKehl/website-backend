import {
  createLoginSuccessResponse,
  hasValidCredentials,
} from '../../src/services/Auth';
import { makeHttpResponse } from '../../src/utils/HttpResponses';
import HttpStatus from '../../common/constants/HttpStatus';
import { getUserWithRefreshToken, RegisteredUser } from '../fixtures/User';
import WithPayloadError from '../../src/utils/Exceptions/WithPayloadError';
import { verify } from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../../config';
import { userResponse, UserWithPassword } from '../../common/fixtures/User';

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
    const res = createLoginSuccessResponse({
      ...userWithRefreshToken,
      ...RegisteredUser,
    });

    const expected = makeHttpResponse({
      statusCode: HttpStatus.OK,
      cookies: [
        {
          name: 'accessToken',
          val: expect.any(String),
          options: {
            sameSite: 'none',
            secure: true,
          },
        },
        {
          name: 'refreshToken',
          val: expect.any(String),
          options: {
            httpOnly: true,
            sameSite: 'none',
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
