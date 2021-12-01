import supertest from 'supertest';
import { Endpoints } from '../../common/constants/Endpoints';
import HttpStatus from '../../common/constants/HttpStatus';
import { User } from '../../src/model/User';
import { RegisteredUser } from '../fixtures/User';
import { getLoggedInCookie, getUniqPort, setupServer } from '../TestSetupUtils';
import { addressDto, contactDto } from '../../common/fixtures/Dto';

const { app } = setupServer({ port: getUniqPort() });

describe(`GET: ${Endpoints.user}`, () => {
  it('returns User dto', async () => {
    await User.create(RegisteredUser);
    const res = await supertest(app)
      .get(`${Endpoints.user}?email=${RegisteredUser.email}`)
      .set(...(await getLoggedInCookie(app)));

    expect(res.status).toEqual(HttpStatus.OK);
    expect(contactDto).toEqual(expect.objectContaining(res.body.contact));
    expect(res.body.address).toEqual(addressDto);
    expect(res.body.email).toEqual(RegisteredUser.email);
    expect(res.body.roles).toEqual(RegisteredUser.roles);
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
