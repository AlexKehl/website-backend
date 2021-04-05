import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { makeHttpError } from '../../src/utils/HttpError';
import {
  getAccessTokenFromHeader,
  withTokenAuth,
} from '../../src/utils/TokenAuth';

config();

describe('getAccessTokenFromHeader', () => {
  it('returns the right token given format "Bearer <token>"', () => {
    const input = {
      authorization: 'Bearer someToken',
    };

    const res = getAccessTokenFromHeader(input);

    expect(res).toEqual('someToken');
  });

  it('returns undefined if there is no authorization header', () => {
    const input = {};

    const res = getAccessTokenFromHeader(input);

    expect(res).toBe(undefined);
  });
});

// describe('authenticateToken', () => {
//   it('returns an http error if token is invalid', () => {
//     const input = {
//       headers: {
//         authorization: `Bearer someToken`,
//       },
//     };
//
//     const res = authenticateToken(input);
//
//     expect(res).toEqual(
//       makeHttpError({
//         statusCode: 403,
//         error: 'Invalid accessToken ',
//       })
//     );
//   });
//
//   it('returns identity if token is valid', () => {
//     const email = 'foo@bar.com';
//     const validAccessToken = jwt.sign(
//       { email },
//       process.env.ACCESS_TOKEN_SECRET,
//       { expiresIn: '45s' }
//     );
//
//     const input = {
//       headers: {
//         authorization: `Bearer ${validAccessToken}`,
//       },
//     };
//
//     const res = authenticateToken(input);
//
//     expect(res).toEqual(input);
//   });
// });

describe('withTokenAuth', () => {
  it('does not call passed fn if token is invalid', () => {
    const mockFn = jest.fn();
    const input = {
      headers: {
        authorization: `Bearer someToken`,
      },
    };

    const res = withTokenAuth(mockFn)(input);

    expect(res).toEqual(
      makeHttpError({
        statusCode: 403,
        error: 'Invalid accessToken ',
      })
    );
    expect(mockFn).not.toHaveBeenCalled();
  });

  it('returns passed fn result if token is valid', async () => {
    const mockFn = jest.fn(async () => 'mockFnRes');

    const email = 'foo@bar.com';
    const validAccessToken = jwt.sign(
      { email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '45s' }
    );

    const input = {
      headers: {
        authorization: `Bearer ${validAccessToken}`,
      },
    };

    const res = await withTokenAuth(mockFn)(input);

    expect(res).toEqual('mockFnRes');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
