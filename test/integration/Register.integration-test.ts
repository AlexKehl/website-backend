import * as request from 'supertest';
import { Endpoints } from '../../common/constants/Endpoints';
import HttpStatus from '../../common/constants/HttpStatus';
import { UserWithPassword } from '../../common/fixtures/User';
import { setupServer } from '../TestSetupUtils';

const { app } = setupServer({ port: 3005 });

it('validates email', async () => {
  const res = await request(app)
    .post(Endpoints.register)
    .send({ email: 'foo', password: '12345678' });

  expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
  expect(res.body.success).toBe(false);
});

it('validates password', async () => {
  const res = await request(app)
    .post(Endpoints.register)
    .send({ email: UserWithPassword.email, password: '123' });

  expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
  expect(res.body.success).toBe(false);
});

it('returns HttpStatus.CREATED on successfull register', async () => {
  const res = await request(app)
    .post(Endpoints.register)
    .send(UserWithPassword);

  expect(res.status).toEqual(HttpStatus.CREATED);
  expect(res.body.success).toBe(true);
});

it('returns HttpStatus.CONFLICT is user exists already', async () => {
  await request(app).post(Endpoints.register).send(UserWithPassword);
  const res = await request(app)
    .post(Endpoints.register)
    .send(UserWithPassword);

  expect(res.status).toEqual(HttpStatus.CONFLICT);
  expect(res.body.success).toBe(false);
});
