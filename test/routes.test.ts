/* global describe, test, afterAll, expect, beforeAll, process, jest */
/*
  @group e2e
*/

import { config } from 'dotenv';
config();

import * as request from 'supertest';
import { MongoClient } from 'mongodb';
import ModuleProviderFn from '../src/ModuleProvider';
import { Express } from 'express-serve-static-core';
import { Server } from 'http';

console.log = jest.fn();

describe('Server routes', () => {
  let client: MongoClient;
  let app: Express;
  let server: Server;
  let Db;
  beforeAll(async () => {
    client = await MongoClient.connect(`mongodb://${process.env.DB_URL}`, {
      useUnifiedTopology: true,
    });
    const mainDb = client.db('test');
    const ModuleProvider = ModuleProviderFn({ mainDb });
    const { Routes } = ModuleProvider;
    Db = ModuleProvider.Db;
    const routesObj = Routes.start(3002);
    app = routesObj.app;
    server = routesObj.server;
  });

  afterAll(() => {
    server.close();
    client.close();
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
    const validUser = await Db.getUser('test@test.com');

    const res = await request(app)
      .post('/token')
      .send({ ...validUser });

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
