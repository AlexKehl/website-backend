import { setupServer } from '../TestSetupUtils';
import * as request from 'supertest';
import HttpStatus from '../../src/utils/HttpStatus';
import { GalleryImage } from '../../src/model/GalleryImage';
import { fileDocs, imagesForConsumer } from '../fixtures/GalleryImages';
import {
  AdminUser,
  generateAccessToken,
  RegisteredUser,
} from '../fixtures/User';
import { User } from '../../src/model/User';

const { app } = setupServer({ port: 3005 });

describe('/file/sync/gallery', () => {
  it('returns HttpStatus.BAD_REQUEST if files are missing', async () => {
    const accessToken = await generateAccessToken(RegisteredUser.email);
    await User.create(AdminUser);

    const res = await request(app)
      .post('/file/sync/gallery')
      .set('Cookie', [`accessToken=${accessToken}`]);

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.success).toBe(false);
  });

  it('returns HttpStatus.BAD_REQUEST if category is missing', async () => {
    const accessToken = await generateAccessToken(RegisteredUser.email);
    await User.create(AdminUser);

    const res = await request(app)
      .post('/file/sync/gallery')
      .set('Cookie', [`accessToken=${accessToken}`]);

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.success).toBe(false);
  });
});

describe('/file/:category', () => {
  it('returns a list of available files', async () => {
    await GalleryImage.insertMany(fileDocs);

    const res = await request(app).get('/files/acryl');

    const expected = [imagesForConsumer[0]];
    expect(res.status).toEqual(HttpStatus.OK);
    expect(res.body.success).toBe(true);
    expect(res.body.images).toEqual(expected);
  });
});
