import { Express } from 'express';
import request from 'supertest';
import UserModel from '../src/model/User';
import { mockServer } from './utils';

console.log = jest.fn();

const server = mockServer();

let app: Express;
beforeAll(async () => {
  app = await server.startServer();
});

afterAll(() => {
  server.stopServer();
});

describe('Server routes', () => {
  test('It should return forbidden (403) for invalid token', async () => {
    const res = await request(app).get('/');

    expect(res.status).toEqual(403);
  });

  test(`login route should return access and refreshToken
  for valid credentials`, async () => {
    const input = { email: 'test@test.com', password: '123' };

    const res = await request(app)
      .post('/login')
      .send(input);

    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      data: {
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      },
      statusCode: 200,
    });
  });

  test('login route should return 401 if credentials are wrong', async () => {
    const input = { email: 'foo@bar.com', password: '123' };

    const res = await request(app)
      .post('/login')
      .send(input);

    expect(res.status).toEqual(401);
    expect(res.body).toEqual({
      error: 'Invalid Credentials',
      success: false,
    });
  });

  test('token route refreshes accessToken given valid refreshToken', async () => {
    const { email, refreshToken } =
      (await UserModel.findOne({
        email: 'test@test.com',
      })) || {};

    const res = await request(app)
      .post('/token')
      .send({ email, refreshToken });

    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      statusCode: 200,
      data: {
        accessToken: expect.any(String),
      },
    });
  });

  test('token route does not refresh accessToken for invalid refreshToken', async () => {
    const input = { email: 'test@test.com', refreshToken: 'someToken' };

    const res = await request(app)
      .post('/token')
      .send({ ...input });

    expect(res.status).toEqual(403);
    expect(res.body).toEqual({
      error: 'Invalid refreshToken',
      success: false,
    });
  });
});
