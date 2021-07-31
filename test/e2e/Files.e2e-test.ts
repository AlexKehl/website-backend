import { setupServer } from '../TestSetupUtils';
import * as request from 'supertest';
import HttpStatus from '../../src/utils/HttpStatus';
import { File } from '../../src/model/File';
import { fileDocs, imagesForConsumer } from '../fixtures/File';
import {
  generateAccessToken,
  generateRefreshTokenAndHash,
  RegisteredUser,
} from '../fixtures/User';

const { app } = setupServer({ port: 3005 });

describe('/file/sync/gallery', () => {
  it('returns HttpStatus.BAD_REQUEST if files are missing', async () => {
    const accessToken = await generateAccessToken(RegisteredUser.email);

    const res = await request(app)
      .post('/file/sync/gallery')
      .set('Cookie', [`accessToken=${accessToken}`])
      .field('category', 'acryl');

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.success).toBe(false);
  });

  it('returns HttpStatus.BAD_REQUEST if some file is corrupt', async () => {
    const accessToken = await generateAccessToken(RegisteredUser.email);

    const res = await request(app)
      .post('/file/sync/gallery')
      .set('Cookie', [`accessToken=${accessToken}`])
      .attach('files', './test/fixtures/CorruptImage.jpg')
      .field('category', 'acryl');

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.success).toBe(false);
  });

  it('returns HttpStatus.BAD_REQUEST if category is missing', async () => {
    const res = await request(app)
      .post('/file/sync/gallery')
      .attach('files', './test/fixtures/TestImage.jpg');

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.success).toBe(false);
  });

  it('returns HttpStatus.OK on successfull upload', async () => {
    const accessToken = await generateAccessToken(RegisteredUser.email);

    const res = await request(app)
      .post('/file/sync/gallery')
      .set('Cookie', [`accessToken=${accessToken}`])
      .attach('files', './test/fixtures/TestImage.jpg')
      .field('category', 'acryl');

    const uploadedFile = await File.findOne({
      name: 'TestImage.jpg',
      category: 'acryl',
    }).exec();

    expect(uploadedFile).toBeDefined();
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
