import { setupServer } from '../TestSetupUtils';
import * as request from 'supertest';
import HttpStatus from '../../src/utils/HttpStatus';
import {
  generateRefreshTokenAndHash,
  RegisteredUser,
  UserWithPassword,
} from '../fixtures/User';
import { User } from '../../src/model/User';

const { app } = setupServer({ port: 3005 });

describe('/login', () => {
  it('validates email', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'foo', password: '12345678' });

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.success).toBe(false);
  });

  it('validates password', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: RegisteredUser.email, password: '123' });

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.success).toBe(false);
  });

  it('logins successfully', async () => {
    const { email, passwordHash } = RegisteredUser;
    const { password } = UserWithPassword;
    const createdUser = new User({ email, passwordHash });
    await createdUser.save();

    const res = await request(app).post('/login').send({ email, password });

    const expectedBody = {
      success: true,
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
      user: {
        email,
      },
    };

    const hasCorrectCookieHeader = [
      res.headers['set-cookie'].find((cookie: string) =>
        cookie.includes('refreshToken')
      ),
      res.headers['set-cookie'].find((cookie: string) =>
        cookie.includes('accessToken')
      ),
    ].every(Boolean);

    expect(res.status).toEqual(HttpStatus.OK);
    expect(res.body).toEqual(expectedBody);
    expect(hasCorrectCookieHeader).toBe(true);
  });

  it('updates refreshTokenHash on successful login', async () => {
    const { email, passwordHash } = RegisteredUser;
    const { password } = UserWithPassword;
    const createdUser = new User({ email, passwordHash });
    await createdUser.save();

    await request(app).post('/login').send({ email, password });

    const userAfterFirstLogin = (await User.findOne({ email }).exec()) || {};

    await request(app).post('/login').send({ email, password });

    const userAfterSecondLogin = (await User.findOne({ email }).exec()) || {};

    expect((userAfterFirstLogin as any).refreshTokenHash).toBeDefined();
    expect((userAfterSecondLogin as any).refreshTokenHash).toBeDefined();
    expect((userAfterFirstLogin as any).refreshTokenHash).not.toEqual(
      (userAfterSecondLogin as any).refreshTokenHash
    );
  });

  it('returns HttpStatus.NOT_FOUND if user is not registered', async () => {
    const res = await request(app).post('/login').send(UserWithPassword);

    expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    expect(res.body.success).toBe(false);
  });

  it('returns HttpStatus.UNAUTHORIZED for invalid credentials', async () => {
    const { email, passwordHash } = RegisteredUser;
    const createdUser = new User({ email, passwordHash });
    await createdUser.save();

    const res = await request(app)
      .post('/login')
      .send({ email, password: 'abcdefghi' });

    expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    expect(res.body.success).toBe(false);
  });
});

describe('/logout', () => {
  it('validates email', async () => {
    const res = await request(app).post('/logout').send({ email: 'foo' });

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.success).toBe(false);
  });

  it('validates refreshToken', async () => {
    const res = await request(app)
      .post('/logout')
      .send({ email: RegisteredUser.email });

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.success).toBe(false);
  });

  it('returns HttpStatus.UNAUTHORIZED if jwt is invalid', async () => {
    const res = await request(app)
      .post('/logout')
      .set('Cookie', ['refreshToken=someInvalidRefreshToken'])
      .send({ email: RegisteredUser.email });

    expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    expect(res.body.success).toBe(false);
  });

  it('returns HttpStatus.FORBIDDEN if token is missing in DB', async () => {
    const { email, passwordHash } = RegisteredUser;
    const createdUser = new User({ email, passwordHash });
    await createdUser.save();

    const res = await request(app)
      .post('/logout')
      .set('Cookie', [
        'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2Mjc2MDAxNDUsImV4cCI6MTYyNzg1OTM0NX0.pGbRCl6SElk8AGYywk760mNQcczWkmZzp44VBEb0KFY',
      ])
      .send({ email: RegisteredUser.email });

    expect(res.status).toEqual(HttpStatus.FORBIDDEN);
    expect(res.body.success).toBe(false);
  });

  it('returns HttpStatus.OK if logout was successful', async () => {
    const { email, passwordHash } = RegisteredUser;
    const {
      refreshToken,
      refreshTokenHash,
    } = await generateRefreshTokenAndHash(email);
    const createdUser = new User({ email, passwordHash, refreshTokenHash });
    await createdUser.save();

    const res = await request(app)
      .post('/logout')
      .set('Cookie', [`refreshToken=${refreshToken}`])
      .send({ email: RegisteredUser.email });

    expect(res.status).toEqual(HttpStatus.OK);
    expect(res.body.success).toBe(true);
  });
});
