/* global describe, it, expect, jest, beforeEach */
/*
  @group unit
*/

import Auth from '../src/auth';

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
  checkUser,
  refreshToken,
  login,
  getAccessTokenFromHeader,
  authenticateToken,
} = Auth({
  env,
  Db,
  jwt,
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('checkUser', () => {
  it('returns false if password doesnt match passwordHash', async () => {
    Db.getUser.mockResolvedValue({ passwordHash: '1234' });
    const input = { email: 'foo@bar.com', password: '123' };

    const res = await checkUser(input);

    expect(res).toBe(false);
  });

  it('returns true if passwordhash matches', async () => {
    Db.getUser.mockResolvedValue({
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
    Db.getUser.mockResolvedValue({
      passwordHash:
        '$2b$10$oXWszZoSMWRJ.PpGVdKqw.xqZBbTpAoAWQnCBBPF2HqtEsTvdJ9K.',
    });
    const input = { email: 'foo@bar.com', password: '123' };

    const res = await login(input);

    expect(res).toEqual({
      accessToken: 'someToken',
      refreshToken: 'someToken',
    });
  });

  it('calls Db.updateUser with email and refreshToken', async () => {
    Db.getUser.mockResolvedValue({ passwordHash: '1234' });
    const input = { email: 'foo@bar.com', password: '123' };

    expect(login(input)).rejects.toEqual({ status: 401 });
  });

  it('updates user doc with new refreshToken after successful login', async () => {
    Db.getUser.mockResolvedValue({
      passwordHash:
        '$2b$10$oXWszZoSMWRJ.PpGVdKqw.xqZBbTpAoAWQnCBBPF2HqtEsTvdJ9K.',
    });
    const input = { email: 'foo@bar.com', password: '123' };

    await login(input);

    expect(Db.updateUser).toHaveBeenCalledWith({
      email: 'foo@bar.com',
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
  it('throws if token is not present', () => {
    const input = {};

    expect(() => {
      authenticateToken(input);
    }).toThrow();
  });

  it('throws if token is invalid (expired or smth.)', () => {
    jwt.verify.mockImplementation(() => {
      throw new Error('someError');
    });
    const input = { authorization: 'Bearer someToken' };

    expect(() => {
      authenticateToken(input);
    }).toThrow();
  });

  // it('adds user to req and calls next if token is valid', () => {
  //   jwt.verify.mockReturnValue({
  //     email: '123',
  //     iat: 1607360812,
  //     exp: 1607360857,
  //   });
  //   const req = {
  //     headers: { authorization: 'Bearer someToken' },
  //   };
  //   const res = {
  //     sendStatus: jest.fn(),
  //   };
  //
  //   const next = jest.fn();
  //
  //   authenticateToken(req, res, next);
  //
  //   expect(res.sendStatus).not.toHaveBeenCalled();
  //   expect(next).toHaveBeenCalledTimes(1);
  //   expect(req).toEqual({
  //     headers: { authorization: 'Bearer someToken' },
  //     user: {
  //       email: '123',
  //       iat: 1607360812,
  //       exp: 1607360857,
  //     },
  //   });
  // });
});

describe('refreshToken', () => {
  it('throws with status 401 if no refreshtoken passed', async () => {
    const input = { email: 123, refreshToken: undefined };

    expect(refreshToken(input)).rejects.toEqual(new Error('http: 401'));
  });

  it('throws status 403 if db has no refreshtoken for this user', async () => {
    Db.getUser.mockResolvedValue({ email: 123 });
    const input = { email: 123, refreshToken: 'someRefreshToken' };

    expect(refreshToken(input)).rejects.toEqual(new Error('http: 403'));
    expect(Db.getUser).toHaveBeenCalledWith(123);
    expect(Db.getUser).toHaveBeenCalledTimes(1);
  });

  it('throws error if jwt.verify throws error', async () => {
    Db.getUser.mockResolvedValue({
      email: 123,
      refreshToken: 'someRefreshToken',
    });
    jwt.verify.mockImplementation(() => {
      throw new Error('someError');
    });
    const input = { email: 123, refreshToken: 'someRefreshToken' };

    expect(refreshToken(input)).rejects.toEqual(new Error('someError'));
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
