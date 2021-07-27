import { evaluateRefreshToken } from '../../src/services/Token';
import { makeHttpError } from '../../src/utils/HttpErrors';
import { makeHttpResponse } from '../../src/utils/HttpResponses';
import HttpStatus from '../../src/utils/HttpStatus';
import { RegisteredUser, UserWithRefreshToken } from '../fixtures/User';

describe('evaluateRefreshToken', () => {
  it('returns NOT_FOUND for no refresh token hash', async () => {
    const { email } = RegisteredUser;

    const res = await evaluateRefreshToken({ email, refreshToken: 'bar' });

    const expected = makeHttpError({
      statusCode: HttpStatus.NOT_FOUND,
      data: {
        error: 'No refreshToken stored',
      },
    });
    expect(res).toEqual(expected);
  });

  it('returns UNAUTHORIZED for invalid refreshTokenHash', async () => {
    const { email, refreshTokenHash } = RegisteredUser;

    const res = await evaluateRefreshToken({
      email,
      refreshToken: 'foo',
      refreshTokenHash,
    });

    const expected = makeHttpError({
      statusCode: HttpStatus.UNAUTHORIZED,
      data: {
        error: 'Invalid refreshToken',
      },
    });
    expect(res).toEqual(expected);
  });

  it('returns OK on successful evaluation', async () => {
    const { email, refreshToken } = UserWithRefreshToken;
    const { refreshTokenHash } = RegisteredUser;

    const res = await evaluateRefreshToken({
      email,
      refreshToken,
      refreshTokenHash,
    });

    const expected = makeHttpResponse({
      statusCode: HttpStatus.OK,
      data: {
        accessToken: expect.any(String),
      },
    });

    expect(res).toEqual(expected);
  });
});
