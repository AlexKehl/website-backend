import { getUniqPort, setupServer } from '../TestSetupUtils';
import request from 'supertest';
import { generateRefreshTokenAndHash, RegisteredUser } from '../fixtures/User';
import { User } from '../../src/model/User';
import HttpStatus from '../../common/constants/HttpStatus';
import { Endpoints } from '../../common/constants/Endpoints';
import { UserWithPassword, userResponse } from '../../common/fixtures/User';
import { createUser, findUser } from '../../src/services/Users';

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
    const { email, _passwordHash } = RegisteredUser;
    const { password } = UserWithPassword;
    const createdUser = new User({ email, _passwordHash });
    await createdUser.save();

    await request(app).post(Endpoints.login).send({ email, password });

    const userAfterFirstLogin = (await User.findOne({ email }).exec()) || {};

    await request(app).post(Endpoints.login).send({ email, password });

    const userAfterSecondLogin = (await User.findOne({ email }).exec()) || {};

    expect((userAfterFirstLogin as any)._refreshTokenHash).toBeDefined();
    expect((userAfterSecondLogin as any)._refreshTokenHash).toBeDefined();
    expect((userAfterFirstLogin as any)._refreshTokenHash).not.toEqual(
      (userAfterSecondLogin as any)._refreshTokenHash
    );
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

describe(Endpoints.logout, () => {
  it('returns HttpStatus.OK if logout was successful', async () => {
    const { email, _passwordHash } = RegisteredUser;
    const { refreshToken, _refreshTokenHash } =
      await generateRefreshTokenAndHash(email);
    const createdUser = new User({ email, _passwordHash, _refreshTokenHash });
    await createdUser.save();

    const res = await request(app)
      .post(Endpoints.logout)
      .set('Cookie', [`refreshToken=${refreshToken}`])
      .send({ email: RegisteredUser.email });

    expect(res.status).toEqual(HttpStatus.OK);
    expect(res.body.success).toBe(true);
  });

  it('deletes refreshTokenHash on successful logout', async () => {
    const { email, _passwordHash } = RegisteredUser;
    const { refreshToken, _refreshTokenHash } =
      await generateRefreshTokenAndHash(email);
    const createdUser = new User({ email, _passwordHash, _refreshTokenHash });
    await createdUser.save();

    await request(app)
      .post(Endpoints.logout)
      .set('Cookie', [`refreshToken=${refreshToken}`])
      .send({ email: RegisteredUser.email });

    const loggedOutUserDoc = await findUser(email);

    expect(loggedOutUserDoc?._refreshTokenHash).not.toBeDefined();
  });
});
