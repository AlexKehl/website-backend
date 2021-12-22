import request from 'supertest';
import { Endpoints } from '../../common/constants/Endpoints';
import HttpStatus from '../../common/constants/HttpStatus';
import HttpTexts from '../../common/constants/HttpTexts';
import { USER_EMAIL } from '../../common/fixtures/User';
import { findUser } from '../../src/model/User';
import { createUser } from '../../src/services/Users';
import { generateEmailToken } from '../fixtures/Tokens';
import { RegisteredUser } from '../fixtures/User';
import { getUniqPort, setupServer } from '../TestSetupUtils';

const { app } = setupServer({ port: getUniqPort() });

describe(Endpoints.emailConfirm, () => {
  it('returns BAD_REQUEST if token is not passed', async () => {
    const res = await request(app).post(Endpoints.emailConfirm);

    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('returns NOT_FOUND if email is not in db', async () => {
    const token = generateEmailToken(USER_EMAIL);

    const res = await request(app).post(Endpoints.emailConfirm).send({ token });

    expect(res.status).toBe(HttpStatus.NOT_FOUND);
    expect(res.body.error).toBe(HttpTexts.userNotExisting);
  });

  it('returns OK and confirms token', async () => {
    const { email } = RegisteredUser;
    const token = generateEmailToken(email);
    await createUser({ ...RegisteredUser, _isEmailConfirmed: false });

    const res = await request(app).post(Endpoints.emailConfirm).send({ token });

    const { _isEmailConfirmed } = (await findUser(email)) || {};
    expect(res.status).toBe(HttpStatus.OK);
    expect(_isEmailConfirmed).toBe(true);
  });
});
