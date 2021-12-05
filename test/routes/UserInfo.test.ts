import supertest from 'supertest';
import { Endpoints } from '../../common/constants/Endpoints';
import HttpStatus from '../../common/constants/HttpStatus';
import { addressDto, contactDto } from '../../common/fixtures/Dto';
import { User } from '../../src/model/User';
import { findUser } from '../../src/services/Users';
import { RegisteredUser } from '../fixtures/User';
import { setupServer, getUniqPort, getLoggedInCookie } from '../TestSetupUtils';

const { app } = setupServer({ port: getUniqPort() });

describe(`POST: ${Endpoints.contactInformation}`, () => {
  it('stores given user data in db', async () => {
    await User.create({
      email: RegisteredUser.email,
      _passwordHash: RegisteredUser._passwordHash,
    });

    const res = await supertest(app)
      .post(Endpoints.contactInformation)
      .set(...(await getLoggedInCookie(app)))
      .send(contactDto);

    const user = await findUser(contactDto.email);

    expect(res.status).toEqual(HttpStatus.OK);
    expect(user!.contact).toEqual(contactDto);
  });

  it('returns HttpStatus.NOT_FOUND if email is not registered', async () => {
    const res = await supertest(app)
      .post(Endpoints.contactInformation)
      .set(...(await getLoggedInCookie(app)))
      .send({ ...contactDto, email: 'foo@bar.com' });

    expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    expect(res.body.error).toEqual('User is not registered');
  });

  it('guards against unauthorized posts', async () => {
    const res = await supertest(app)
      .post(Endpoints.contactInformation)
      .send(contactDto);

    expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
  });
});

describe(`POST: ${Endpoints.addressInformation}`, () => {
  it('stores given user data in db', async () => {
    await User.create({
      email: RegisteredUser.email,
      _passwordHash: RegisteredUser._passwordHash,
    });

    const res = await supertest(app)
      .post(Endpoints.addressInformation)
      .set(...(await getLoggedInCookie(app)))
      .send(addressDto);

    const user = await findUser(RegisteredUser.email);

    expect(res.status).toEqual(HttpStatus.OK);
    expect(user!.address).toEqual(addressDto);
  });

  it('guards against unauthorized posts', async () => {
    const res = await supertest(app)
      .post(Endpoints.addressInformation)
      .send(addressDto);

    expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
  });
});
