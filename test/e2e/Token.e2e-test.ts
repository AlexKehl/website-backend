import * as request from 'supertest';
import { User } from '../../src/model/User';
import HttpStatus from '../../src/utils/HttpStatus';
import {
  generateAccessToken,
  generateRefreshTokenAndHash,
  RegisteredUser,
} from '../fixtures/User';
import { setupServer } from '../TestSetupUtils';

const { app } = setupServer({ port: 3005 });

describe('/refreshtoken', () => {
  it('returns a new accessToken', async () => {
    const { email, passwordHash } = RegisteredUser;
    const accessToken = generateAccessToken(email);
    const {
      refreshToken,
      refreshTokenHash,
    } = await generateRefreshTokenAndHash(email);

    await User.create({
      email,
      passwordHash,
      refreshTokenHash,
      roles: ['RegisteredUser'],
    });

    const res = await request(app)
      .post('/refreshtoken')
      .set('Cookie', [`accessToken=${accessToken}`])
      .set('Cookie', [`refreshToken=${refreshToken}`]);

    expect(res.header['set-cookie'][0].includes('accessToken')).toBe(true);
    expect(res.status).toBe(HttpStatus.OK);
  });

  it('returns BAD_REQUEST if refreshToken is not passed', async () => {
    const res = await request(app).post('/refreshtoken');

    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('returns UNAUTHORIZED for no refreshToken in db', async () => {
    const { email } = RegisteredUser;
    const { refreshToken } = await generateRefreshTokenAndHash(email);

    const res = await request(app)
      .post('/refreshtoken')
      .set('Cookie', [`refreshToken=${refreshToken}`]);

    expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('returns UNAUTHORIZED for for wrong refreshTokenHash', async () => {
    const { email, passwordHash } = RegisteredUser;
    const {
      refreshToken,
      refreshTokenHash,
    } = await generateRefreshTokenAndHash(email);

    await User.create({
      email,
      passwordHash,
      refreshTokenHash,
      roles: ['RegisteredUser'],
    });

    const res = await request(app)
      .post('/refreshtoken')
      .set('Cookie', [`refreshToken=${refreshToken}123`]);

    expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
  });
});
