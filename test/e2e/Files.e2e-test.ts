import { setupServer } from '../TestSetupUtils';
import * as request from 'supertest';
import HttpStatus from '../../src/utils/HttpStatus';
import { File } from '../../src/model/File';
import { fileDocs, imagesForConsumer } from '../fixtures/File';

const { app } = setupServer({ port: 3005 });

describe('/file/upload', () => {
  it('returns HttpStatus.BAD_REQUEST if file is missing', async () => {
    const res = await request(app)
      .post('/file/upload')
      .field('category', 'Acryl');

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.success).toBe(false);
  });

  it('returns HttpStatus.BAD_REQUEST if file is corrupt', async () => {
    const res = await request(app)
      .post('/file/upload')
      .attach('file', './test/fixtures/CorruptImage.jpg')
      .field('category', 'Acryl');

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.success).toBe(false);
  });

  it('returns HttpStatus.BAD_REQUEST if category is missing', async () => {
    const res = await request(app)
      .post('/file/upload')
      .attach('file', './test/fixtures/TestImage.jpg');

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.success).toBe(false);
  });

  it('returns HttpStatus.OK upload was successfull', async () => {
    const res = await request(app)
      .post('/file/upload')
      .attach('file', './test/fixtures/TestImage.jpg')
      .field('category', 'Acryl');

    expect(res.status).toEqual(HttpStatus.OK);
    expect(res.body.success).toBe(true);
  });
});

describe('/file/:category', () => {
  it('returns a list of available files', async () => {
    await File.insertMany(fileDocs);

    const res = await request(app).get('/files/acryl');

    const expected = [imagesForConsumer[0]];
    expect(res.status).toEqual(HttpStatus.OK);
    expect(res.body.success).toBe(true);
    expect(res.body.images).toEqual(expected);
  });
});
