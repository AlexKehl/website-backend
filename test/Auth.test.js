const { setupModelTest } = require('test/utils');
const { makeHttpResponse } = require('src/utils/HttpResponse');
const { makeHttpError } = require('src/utils/HttpError');

const {
  checkUser,
  login,
  refreshToken,
  authenticateToken,
  getAccessTokenFromHeader,
} = require('src/Auth');

const UserModel = require('src/model/User');

setupModelTest(UserModel, 'auth');

describe('checkUser', () => {
  it('returns false if password doesnt match passwordHash', async () => {
    await UserModel.create({
      email: 'foo',
      passwordHash: '1234',
    });

    const input = { email: 'foo@bar.com', password: '123' };

    const res = await checkUser(input);

    expect(res).toBe(false);
  });

  it('returns true if passwordhash matches', async () => {
    await UserModel.create({
      email: 'foo@bar.com',
      passwordHash:
        '$2b$10$oXWszZoSMWRJ.PpGVdKqw.xqZBbTpAoAWQnCBBPF2HqtEsTvdJ9K.',
    });
    const input = { email: 'foo@bar.com', password: '123' };

    const res = await checkUser(input);

    expect(res).toBe(true);
  });
});

describe('login', () => {
  it('returns an object with accessToken and refreshToken', async () => {
    await UserModel.create({
      email: 'foo@bar.com',
      passwordHash:
        '$2b$10$oXWszZoSMWRJ.PpGVdKqw.xqZBbTpAoAWQnCBBPF2HqtEsTvdJ9K.',
    });
    const input = { body: { email: 'foo@bar.com', password: '123' } };

    const res = await login(input);

    const expected = makeHttpResponse({
      statusCode: 200,
      data: {
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      },
    });

    expect(res).toEqual(expected);
  });

  it('an http error if credentials are invalid', async () => {
    const input = { body: { email: 'foo@bar.com', password: '123' } };
    const res = await login(input);

    const expected = makeHttpError({
      statusCode: 401,
      error: 'Invalid Credentials',
    });
    expect(res).toEqual(expected);
  });

  it('updates user doc with new refreshToken after successful login', async () => {
    await UserModel.create({
      email: 'foo@bar.com',
      passwordHash:
        '$2b$10$oXWszZoSMWRJ.PpGVdKqw.xqZBbTpAoAWQnCBBPF2HqtEsTvdJ9K.',
    });
    const input = { body: { email: 'foo@bar.com', password: '123' } };

    await login(input);

    const { refreshToken } = await UserModel.findOne({
      email: 'foo@bar.com',
    });

    expect(typeof refreshToken).toEqual('string');
  });
});

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

describe('authenticateToken', () => {
  it('throws if token is not present', () => {
    const input = {};

    expect(() => {
      authenticateToken(input);
    }).toThrow();
  });

  it('throws if token is invalid (expired or smth.)', () => {
    const input = { authorization: 'Bearer someToken' };

    expect(() => {
      authenticateToken(input);
    }).toThrow();
  });
});

describe('refreshToken', () => {
  it('returns status 401 if db has no refreshtoken for this user', async () => {
    await UserModel.create({
      email: 'foo@bar.com',
    });
    const input = {
      body: { email: 'foo@bar.com', refreshToken: 'someRefreshToken' },
    };

    const res = await refreshToken(input);

    const expected = makeHttpError({
      statusCode: 401,
      error: 'No refreshToken stored',
    });
    expect(res).toEqual(expected);
  });

  it('returns status 403 if jwt.verify throws', async () => {
    await UserModel.create({
      email: 'foo@bar.com',
      refreshToken: 'someRefreshToken',
    });
    const input = {
      body: { email: 'foo@bar.com', refreshToken: 'someRefreshToken' },
    };

    const res = await refreshToken(input);

    const expected = makeHttpError({
      statusCode: 403,
      error: 'Invalid refreshToken',
    });
    expect(res).toEqual(expected);
  });

  it('returns obj with new accessToken if jwt.verify was successful', async () => {
    await UserModel.create({
      email: '123',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2MDc4MDY2NDZ9.zZuoh9FrFjQiJk_3gtX0IJsafE9tz4-pP8LrgNF0OW8',
    });
    const input = {
      body: {
        email: '123',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2MDc4MDY2NDZ9.zZuoh9FrFjQiJk_3gtX0IJsafE9tz4-pP8LrgNF0OW8',
      },
    };

    const res = await refreshToken(input);

    const expected = makeHttpResponse({
      statusCode: 200,
      data: {
        accessToken: expect.any(String),
      },
    });

    expect(res).toEqual(expected);
  });

  it('returns 403 if token is valid but is not from this user', async () => {
    await UserModel.create({
      email: '123',
      refreshToken: 'someOtherToken',
    });
    const input = {
      body: {
        email: '123',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2MDc4MDY2NDZ9.zZuoh9FrFjQiJk_3gtX0IJsafE9tz4-pP8LrgNF0OW8',
      },
    };

    const res = await refreshToken(input);

    const expected = makeHttpError({
      statusCode: 403,
      error: 'Invalid refreshToken',
    });

    expect(res).toEqual(expected);
  });

  it('returns 401 if email not found in db', async () => {
    const input = {
      body: {
        email: '123',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2MDc4MDY2NDZ9.zZuoh9FrFjQiJk_3gtX0IJsafE9tz4-pP8LrgNF0OW8',
      },
    };

    const res = await refreshToken(input);

    const expected = makeHttpError({
      statusCode: 401,
      error: 'No refreshToken stored',
    });

    expect(res).toEqual(expected);
  });
});
