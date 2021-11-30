import supertest from 'supertest';
import { Endpoints } from '../../common/constants/Endpoints';
import HttpStatus from '../../common/constants/HttpStatus';
import { User } from '../../src/model/User';
import { findUser } from '../../src/services/Users';
import { contactDto, RegisteredUser } from '../fixtures/User';
import { setupServer, getUniqPort, getLoggedInCookie } from '../TestSetupUtils';

const { app } = setupServer({ port: getUniqPort() });

describe(Endpoints.contactInformation, () => {
  it('stores given user data in db', async () => {
    await User.create({
      email: RegisteredUser.email,
      passwordHash: RegisteredUser.passwordHash,
    });

    const res = await supertest(app)
      .post(Endpoints.contactInformation)
      .set(...(await getLoggedInCookie(app)))
      .send(contactDto);

    const user = await findUser(contactDto.email);

    expect(res.status).toEqual(HttpStatus.OK);
    expect(user).toEqual(expect.objectContaining(contactDto));
  });

  it('returns proper error message if operation fails', async () => {
    const res = await supertest(app)
      .post(Endpoints.contactInformation)
      .set(...(await getLoggedInCookie(app)))
      .send({ ...contactDto, email: 'foo@bar.com' });

    expect(res.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.body.error).toEqual('Could not write user data to db');
  });

  it('guards against unauthorized posts', async () => {
    const res = await supertest(app)
      .post(Endpoints.contactInformation)
      .send(contactDto);

    expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
  });
});
