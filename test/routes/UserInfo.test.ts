import supertest from 'supertest';
import { Endpoints } from '../../common/constants/Endpoints';
import HttpStatus from '../../common/constants/HttpStatus';
import { addressDto, contactDto } from '../../common/fixtures/Dto';
import { findUser, User } from '../../src/model/User';
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
      .set(...(await getLoggedInCookie(app)(RegisteredUser)))
      .send(contactDto);

    const user = await findUser(RegisteredUser.email);

    expect(res.status).toEqual(HttpStatus.OK);
    expect(user!.contact).toEqual(contactDto);
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
      .set(...(await getLoggedInCookie(app)(RegisteredUser)))
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
