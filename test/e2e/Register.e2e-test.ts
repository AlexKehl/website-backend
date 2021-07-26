import * as request from 'supertest';
import HttpStatus from '../../src/utils/HttpStatus';
import { UserWithPassword } from '../fixtures/User';
import { setupServer } from '../TestSetupUtils';

const { app } = setupServer();

describe('/register', () => {
  it('validates email', async () => {
    const res = await request(app)
      .post('/register')
      .send({ email: 'foo', password: '12345678' });

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.success).toBe(false);
  });

  it('validates password', async () => {
    const res = await request(app)
      .post('/register')
      .send({ email: UserWithPassword.email, password: '123' });

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.success).toBe(false);
  });

  it('returns HttpStatus.CREATED on successfull register', async () => {
    const res = await request(app).post('/register').send(UserWithPassword);

    expect(res.status).toEqual(HttpStatus.CREATED);
    expect(res.body.success).toBe(true);
  });

  it('returns HttpStatus.CONFLICT is user exists already', async () => {
    await request(app).post('/register').send(UserWithPassword);
    const res = await request(app).post('/register').send(UserWithPassword);

    expect(res.status).toEqual(HttpStatus.CONFLICT);
    expect(res.body.success).toBe(false);
  });
});
