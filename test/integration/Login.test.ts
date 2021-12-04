import { getUniqPort, setupServer } from '../TestSetupUtils';
import request from 'supertest';
import { RegisteredUser } from '../fixtures/User';
import { User } from '../../src/model/User';
import HttpStatus from '../../common/constants/HttpStatus';
import { Endpoints } from '../../common/constants/Endpoints';
import { UserWithPassword, userResponse } from '../../common/fixtures/User';
import { createUser } from '../../src/services/Users';

const { app } = setupServer({ port: getUniqPort() });

describe(Endpoints.login, () => {
  it('validates email', async () => {
    const res = await request(app)
      .post(Endpoints.login)
      .send({ email: 'foo', password: '12345678' });

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.success).toBe(false);
  });

  it('validates password', async () => {
    const res = await request(app)
      .post(Endpoints.login)
      .send({ email: RegisteredUser.email, password: '123' });

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.success).toBe(false);
  });

  it('logins successfully', async () => {
    const { email } = RegisteredUser;
    const { password } = UserWithPassword;

    await createUser(RegisteredUser);

    const res = await request(app)
      .post(Endpoints.login)
      .send({ email, password });

    const expectedBody = {
      success: true,
      user: userResponse,
      accessToken: expect.any(String),
    };

    const hasCorrectCookieHeader = [
      res.headers['set-cookie'].find((cookie: string) =>
        cookie.includes('accessToken')
      ),
    ].every(Boolean);

    expect(res.status).toEqual(HttpStatus.OK);
    expect(res.body).toEqual(expectedBody);
    expect(hasCorrectCookieHeader).toBe(true);
  });

  it('returns HttpStatus.NOT_FOUND if user is not registered', async () => {
    const res = await request(app).post(Endpoints.login).send(UserWithPassword);

    expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    expect(res.body.success).toBe(false);
  });

  it('returns HttpStatus.UNAUTHORIZED for invalid credentials', async () => {
    const { email, _passwordHash } = RegisteredUser;
    const createdUser = new User({ email, _passwordHash });
    await createdUser.save();

    const res = await request(app)
      .post(Endpoints.login)
      .send({ email, password: 'abcdefghi' });

    expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    expect(res.body.success).toBe(false);
  });
});
