import supertest from 'supertest';
import { Endpoints } from '../../common/constants/Endpoints';
import HttpStatus from '../../common/constants/HttpStatus';
import { User } from '../../src/model/User';
import { contactDto, RegisteredUser } from '../fixtures/User';
import { getLoggedInCookie, getUniqPort, setupServer } from '../TestSetupUtils';

const { app } = setupServer({ port: getUniqPort() });

describe(`GET: ${Endpoints.user}`, () => {
  it('returns contactInformation dto', async () => {
    await User.create(RegisteredUser);
    const res = await supertest(app)
      .get(`${Endpoints.user}?email=${RegisteredUser.email}`)
      .set(...(await getLoggedInCookie(app)));

    expect(res.status).toEqual(HttpStatus.OK);
    expect(res.body).toEqual(expect.objectContaining(contactDto));
  });

  it('returns HttpStatus.NOT_FOUND', async () => {
    const res = await supertest(app)
      .get(`${Endpoints.user}?email=foo@bar.com`)
      .set(...(await getLoggedInCookie(app)));

    const expectedBody = { error: 'User not found', success: false };
    expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    expect(res.body).toEqual(expectedBody);
  });

  it('returns HttpStatus.UNAUTHORIZED', async () => {
    const res = await supertest(app).get(`${Endpoints.user}?email=foo@bar.com`);

    expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
  });
});
