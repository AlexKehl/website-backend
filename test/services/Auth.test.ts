import {
  createLoginSuccessResponse,
  hasValidCredentials,
} from '../../src/services/Auth';
import { makeHttpResponse } from '../../src/utils/HttpResponses';
import HttpStatus from '../../common/constants/HttpStatus';
import { RegisteredUser } from '../fixtures/User';
import WithPayloadError from '../../src/utils/Exceptions/WithPayloadError';
import { verify } from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../../config';
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
    const res = createLoginSuccessResponse(RegisteredUser);

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
      ],
      data: {
        user: userResponse,
        accessToken: expect.any(String),
      },
    });

    expect(res).toEqual(expected);
    expect(verify(res.cookies[0].val, ACCESS_TOKEN_SECRET)).toBeDefined();
  });
});
