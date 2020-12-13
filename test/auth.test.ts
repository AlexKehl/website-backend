/* global describe, it, expect, jest, beforeEach */
/*
  @group unit
*/

import { config } from 'dotenv';

config();

import {
  checkUser,
  login,
  refreshToken,
  authenticateToken,
  getAccessTokenFromHeader,
} from '@/Auth';

import UserModel from '@/model/User';

jest.mock('@/model/User');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('checkUser', () => {
  it('returns false if password doesnt match passwordHash', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue({
      email: 'foo',
      passwordHash: '1234',
    });
    const input = { email: 'foo@bar.com', password: '123' };

    const res = await checkUser(input);

    expect(res).toBe(false);
  });

  it('returns true if passwordhash matches', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue({
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
    (UserModel.findOne as jest.Mock).mockResolvedValue({
      passwordHash:
        '$2b$10$oXWszZoSMWRJ.PpGVdKqw.xqZBbTpAoAWQnCBBPF2HqtEsTvdJ9K.',
    });
    const input = { email: 'foo@bar.com', password: '123' };

    const res = await login(input);

    expect(res).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it('throws an error if credentials are invalid', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue({
      passwordHash: '1234',
    });
    const input = { email: 'foo@bar.com', password: '123' };

    expect(login(input)).rejects.toEqual(new Error('http: 401'));
  });

  it('updates user doc with new refreshToken after successful login', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue({
      passwordHash:
        '$2b$10$oXWszZoSMWRJ.PpGVdKqw.xqZBbTpAoAWQnCBBPF2HqtEsTvdJ9K.',
    });
    const input = { email: 'foo@bar.com', password: '123' };

    await login(input);

    expect(UserModel.updateOne).toHaveBeenCalledWith(
      {
        email: 'foo@bar.com',
      },
      {
        refreshToken: expect.any(String),
      },
    );
    expect(UserModel.updateOne).toHaveBeenCalledTimes(1);
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
  it('throws status 403 if db has no refreshtoken for this user', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue({ email: 123 });
    const input = { email: '123', refreshToken: 'someRefreshToken' };

    expect(refreshToken(input)).rejects.toEqual(new Error('http: 403'));
    expect(UserModel.findOne).toHaveBeenCalledWith({ email: '123' });
    expect(UserModel.findOne).toHaveBeenCalledTimes(1);
  });

  it('throws error if jwt.verify throws error', async () => {
    (UserModel.findOne as jest.Mock)({
      email: '123',
      refreshToken: 'someRefreshToken',
    });
    const input = { email: '123', refreshToken: 'someRefreshToken' };

    expect(refreshToken(input)).rejects.toEqual(new Error('http: 403'));
  });

  it('returns obj with new accessToken if jwt.verify was successful', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue({
      email: '123',
      refreshToken: 'someRefreshToken',
    });
    const input = {
      email: '123',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2MDc4MDY2NDZ9.zZuoh9FrFjQiJk_3gtX0IJsafE9tz4-pP8LrgNF0OW8',
    };

    const res = await refreshToken(input);

    expect(res).toEqual({ accessToken: expect.any(String) });
  });
});
