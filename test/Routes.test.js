/* global describe, test, afterAll, expect, beforeAll, process, jest */
/*
  @group e2e
*/

const { config } = require('dotenv');
config();

const request = require('supertest');
const { connect } = require('mongoose');
const { Server } = require('http');
const { start } = require('src/Routes');
const UserModel = require('src/model/User');

console.log = jest.fn();

describe('Server routes', () => {
  let connection;
  let server;
  let app;
  beforeAll(async () => {
    connection = await connect(
      `mongodb://${process.env.DB_URL}`,
      { dbName: 'main', useUnifiedTopology: true, useNewUrlParser: true },
    );
    const routesObj = start(3002);
    app = routesObj.app;
    server = routesObj.server;
  });

  afterAll(() => {
    server.close();
    connection.disconnect();
  });

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
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  test('login route should return 401 if credentials are wrong', async () => {
    const input = { email: 'foo@bar.com', password: '123' };

    const res = await request(app)
      .post('/login')
      .send(input);

    expect(res.status).toEqual(401);
    expect(res.body).toEqual({});
  });

  test('token route refreshes accessToken given valid refreshToken', async () => {
    const { email, refreshToken } = await UserModel.findOne({
      email: 'test@test.com',
    });

    const res = await request(app)
      .post('/token')
      .send({ email, refreshToken });

    expect(res.status).toEqual(200);
    expect(res.body.accessToken).toEqual(expect.any(String));
  });

  test('token route does not refresh accessToken for invalid refreshToken', async () => {
    const input = { email: 'test@test.com', refreshToken: 'someToken' };

    const res = await request(app)
      .post('/token')
      .send({ ...input });

    expect(res.status).toEqual(403);
    expect(res.body).toEqual({});
  });
});
