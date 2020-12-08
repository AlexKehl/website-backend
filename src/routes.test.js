/* global describe, test, afterAll, expect, beforeAll, process */

require('dotenv').config();

const request = require('supertest');
const MongoClient = require('mongodb').MongoClient;

describe('Server routes', () => {
  let Routes;
  let client;
  let app;
  let server;
  beforeAll(async () => {
    client = await MongoClient.connect(`mongodb://${process.env.DB_URL}`, {
      useUnifiedTopology: true,
    });
    const mainDb = client.db('test');
    Routes = require('./ModuleProvider')({ mainDb }).Routes;
    const routesObj = Routes.start(3002);
    app = routesObj.app;
    server = routesObj.server;
  });

  afterAll(() => {
    server.close();
    client.close();
  });

  test('It should return unauthorized (401) for invalid token', async () => {
    const res = await request(app).get('/');

    expect(res.statusCode).toEqual(401);
  });

  test(`login route should return access and refreshToken
  for valid credentials`, async () => {
    const input = { email: 'test@test.com', password: '123' };

    const res = await request(app)
      .post('/login')
      .send(input);

    expect(res.statusCode).toEqual(200);
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

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual({});
  });
});
