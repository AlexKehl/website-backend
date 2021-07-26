import { setupServer } from '../TestSetupUtils';
import * as request from 'supertest';
import HttpStatus from '../../src/utils/HttpStatus';
import { RegisteredUser, UserWithPassword } from '../fixtures/User';
import { User } from '../../src/model/User';

const { app } = setupServer({ port: 3005 });

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
