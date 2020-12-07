/* global describe, it, expect, jest, beforeEach */

const env = {
  ACCESS_TOKEN_SECRET: '444',
  REFRESH_TOKEN_SECRET: '123',
};

const jwt = {
  sign: jest.fn(() => 'someToken'),
  verify: jest.fn(() => 'someToken'),
};

const Db = {
  updateUser: jest.fn(),
  getUser: jest.fn(),
};

const {
  refreshToken,
  login,
  getAccessTokenFromHeader,
  authenticateToken,
} = require('../src/auth')({
  env,
  Db,
  jwt,
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('login', () => {
  it('works', () => {
    expect(true).toEqual(true);
  });

  it('returns an object with accessToken and refreshToken', async () => {
    const input = { email: 'foo@bar.com' };

    const res = await login(input);

    expect(res).toEqual({
      accessToken: 'someToken',
      refreshToken: 'someToken',
    });
  });

  it('It calls Db.updateUser with email and refreshToken', async () => {
    const input = { email: 'foo@bar.com' };

    await login(input);

    expect(Db.updateUser).toHaveBeenCalledWith({
      ...input,
      refreshToken: 'someToken',
    });
    expect(Db.updateUser).toHaveBeenCalledTimes(1);
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
  it('returns 401 if token is not present', () => {
    const req = {
      headers: {},
    };
    const res = {
      sendStatus: jest.fn(),
    };

    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledTimes(1);
    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('sends 403 if token is invalid (expired or smth.)', () => {
    jwt.verify.mockImplementation(() => {
      throw new Error('someError');
    });
    const req = {
      headers: { authorization: 'Bearer someToken' },
    };
    const res = {
      sendStatus: jest.fn(),
    };

    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledTimes(1);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('adds user to req and calls next if token is valid', () => {
    jwt.verify.mockReturnValue({
      email: '123',
      iat: 1607360812,
      exp: 1607360857,
    });
    const req = {
      headers: { authorization: 'Bearer someToken' },
    };
    const res = {
      sendStatus: jest.fn(),
    };

    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(req).toEqual({
      headers: { authorization: 'Bearer someToken' },
      user: {
        email: '123',
        iat: 1607360812,
        exp: 1607360857,
      },
    });
  });
});

describe('refreshToken', () => {
  it('returns status 401 if no refreshtoken passed', async () => {
    const input = { email: 123 };

    const res = await refreshToken(input);

    expect(res).toEqual({ status: 401 });
  });

  it('returns status 403 if db has no refreshtoken for this user', async () => {
    Db.getUser.mockResolvedValue({ email: 123 });
    const input = { email: 123, refreshToken: 'someRefreshToken' };

    const res = await refreshToken(input);

    expect(res).toEqual({ status: 403 });
    expect(Db.getUser).toHaveBeenCalledWith(123);
    expect(Db.getUser).toHaveBeenCalledTimes(1);
  });

  it('returns status 403 if jwt.verify throws error', async () => {
    Db.getUser.mockResolvedValue({
      email: 123,
      refreshToken: 'someRefreshToken',
    });
    jwt.verify.mockImplementation(() => {
      throw new Error('someError');
    });
    const input = { email: 123, refreshToken: 'someRefreshToken' };

    const res = await refreshToken(input);

    expect(res).toEqual({ status: 403 });
  });

  it('returns obj with new accessToken if jwt.verify was successful', async () => {
    Db.getUser.mockResolvedValue({
      email: 123,
      refreshToken: 'someRefreshToken',
    });
    jwt.verify.mockReturnValue('someAccessToken');
    const input = { email: 123, refreshToken: 'someRefreshToken' };

    const res = await refreshToken(input);

    expect(res).toEqual({ accessToken: 'someToken' });
  });
});
