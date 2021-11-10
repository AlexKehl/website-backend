import request from 'supertest';
import { Endpoints } from '../../common/constants/Endpoints';
import HttpStatus from '../../common/constants/HttpStatus';
import HttpTexts from '../../common/constants/HttpTexts';
import { USER_EMAIL } from '../../common/fixtures/User';
import { User } from '../../src/model/User';
import { createUser, findUser } from '../../src/services/Users';
import { generateEmailToken } from '../fixtures/Tokens';
import {
  generateAccessToken,
  generateRefreshTokenAndHash,
  RegisteredUser,
} from '../fixtures/User';
import { getUniqPort, setupServer } from '../TestSetupUtils';

const { app } = setupServer({ port: getUniqPort() });

describe(Endpoints.refreshAccessToken, () => {
  it('returns a new accessToken', async () => {
    const { email, passwordHash } = RegisteredUser;
    const accessToken = generateAccessToken(email);
    const { refreshToken, refreshTokenHash } =
      await generateRefreshTokenAndHash(email);

    await User.create({
      email,
      passwordHash,
      refreshTokenHash,
      roles: ['RegisteredUser'],
    });

    const res = await request(app)
      .post(Endpoints.refreshAccessToken)
      .set('Cookie', [`accessToken=${accessToken}`])
      .set('Cookie', [`refreshToken=${refreshToken}`]);

    expect(res.header['set-cookie'][0].includes('accessToken')).toBe(true);
    expect(res.status).toBe(HttpStatus.OK);
  });

  it('returns BAD_REQUEST if refreshToken is not passed', async () => {
    const res = await request(app).post(Endpoints.refreshAccessToken);

    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('returns UNAUTHORIZED for no refreshToken in db', async () => {
    const { email } = RegisteredUser;
    const { refreshToken } = await generateRefreshTokenAndHash(email);

    const res = await request(app)
      .post(Endpoints.refreshAccessToken)
      .set('Cookie', [`refreshToken=${refreshToken}`]);

    expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('returns UNAUTHORIZED for for wrong refreshTokenHash', async () => {
    const { email, passwordHash } = RegisteredUser;
    const { refreshToken, refreshTokenHash } =
      await generateRefreshTokenAndHash(email);

    await User.create({
      email,
      passwordHash,
      refreshTokenHash,
      roles: ['RegisteredUser'],
    });

    const res = await request(app)
      .post(Endpoints.refreshAccessToken)
      .set('Cookie', [`refreshToken=${refreshToken}123`]);

    expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
  });
});

describe(Endpoints.emailConfirm, () => {
  it('returns BAD_REQUEST if token is not passed', async () => {
    const res = await request(app).post(Endpoints.emailConfirm);

    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('returns BAD_REQUEST if email is not in db', async () => {
    const token = generateEmailToken(USER_EMAIL);

    const res = await request(app).post(Endpoints.emailConfirm).send({ token });

    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
    expect(res.body.error).toBe(HttpTexts.userNotExisting);
  });

  it('returns OK and confirms token', async () => {
    const { email } = RegisteredUser;
    const token = generateEmailToken(email);
    await createUser(RegisteredUser);

    const res = await request(app).post(Endpoints.emailConfirm).send({ token });

    const { isEmailConfirmed } = (await findUser(email)) || {};
    expect(res.status).toBe(HttpStatus.OK);
    expect(isEmailConfirmed).toBe(true);
  });

  it('returns OK and confirms token', async () => {
    const { email } = RegisteredUser;
    const token = generateEmailToken(email);
    await createUser(RegisteredUser);

    const res = await request(app).post(Endpoints.emailConfirm).send({ token });

    const { isEmailConfirmed } = (await findUser(email)) || {};
    expect(res.status).toBe(HttpStatus.OK);
    expect(isEmailConfirmed).toBe(true);
  });
});
