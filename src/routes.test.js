/* global describe, it, afterAll, beforeAll, process */

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

  it('should create a new post', async () => {
    const res = await request(app).get('/');
    console.log(res);
    //   .send({
    //     userId: 1,
    //     title: 'test is cool',
    //   });
    // expect(res.statusCode).toEqual(201);
    // expect(res.body).toHaveProperty('post');
  });
});
