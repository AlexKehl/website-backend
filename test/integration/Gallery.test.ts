import { getUniqPort, setupServer } from '../TestSetupUtils';
import request from 'supertest';
import { GalleryImage } from '../../src/model/GalleryImage';
import { galleryImageDocs } from '../fixtures/GalleryImages';
import {
  AdminUser,
  generateAccessToken,
  RegisteredUser,
} from '../fixtures/User';
import { User } from '../../src/model/User';
import { GalleryImageDto } from '../../common/interface/Dto';
import HttpStatus from '../../common/constants/HttpStatus';
import { Endpoints } from '../../common/constants/Endpoints';
import {
  galleryImageDto,
  imagesForGallery,
} from '../../common/fixtures/GalleryImages';

const { app } = setupServer({ port: getUniqPort() });

describe(Endpoints.galleryUpload, () => {
  it('returns HttpStatus.BAD_REQUEST if files are missing', async () => {
    const accessToken = await generateAccessToken(AdminUser.email);
    await User.create(AdminUser);

    const res = await request(app)
      .post(Endpoints.galleryUpload)
      .set('Cookie', [`accessToken=${accessToken}`]);

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.success).toBe(false);
  });

  it('returns HttpStatus.BAD_REQUEST if category is missing', async () => {
    const accessToken = await generateAccessToken(AdminUser.email);
    await User.create(AdminUser);

    const res = await request(app)
      .post(Endpoints.galleryUpload)
      .set('Cookie', [`accessToken=${accessToken}`]);

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.success).toBe(false);
  });

  it('returns HttpStatus.BAD_REQUEST if isForSell && !price', async () => {
    const accessToken = await generateAccessToken(AdminUser.email);
    await User.create(AdminUser);

    const { price, ...imageRest } = galleryImageDto;
    const body: GalleryImageDto = imageRest;

    const res = await request(app)
      .post(Endpoints.galleryUpload)
      .set('Cookie', [`accessToken=${accessToken}`])
      .send(body);

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.success).toBe(false);
    expect(res.body.errors[0].param).toEqual('price');
  });

  it('successfully uploads', async () => {
    const accessToken = await generateAccessToken(AdminUser.email);
    await User.create(AdminUser);

    const res = await request(app)
      .post(Endpoints.galleryUpload)
      .set('Cookie', [`accessToken=${accessToken}`])
      .send(galleryImageDto);

    const newDoc = await GalleryImage.findOne({
      name: galleryImageDto.name,
    }).exec();

    expect(res.status).toEqual(HttpStatus.OK);
    expect(res.body.success).toBe(true);
    expect(newDoc?.name).toEqual(galleryImageDto.name);
  });

  it('does not store b64 encoded image in db', async () => {
    const accessToken = await generateAccessToken(RegisteredUser.email);
    await User.create(AdminUser);

    await request(app)
      .post(Endpoints.galleryUpload)
      .set('Cookie', [`accessToken=${accessToken}`])
      .send(galleryImageDto);

    const newDoc = await GalleryImage.findOne({
      name: galleryImageDto.name,
    }).exec();

    expect((newDoc as any).image).not.toBeDefined();
  });

  it('updates already existing images', async () => {
    const accessToken = await generateAccessToken(AdminUser.email);
    await User.create(AdminUser);

    await request(app)
      .post(Endpoints.galleryUpload)
      .set('Cookie', [`accessToken=${accessToken}`])
      .send(galleryImageDto);

    const modifiedImageDto = { ...galleryImageDto, description: 'updated' };

    await request(app)
      .post(Endpoints.galleryUpload)
      .set('Cookie', [`accessToken=${accessToken}`])
      .send(modifiedImageDto);

    const newDocs = await GalleryImage.find({
      name: galleryImageDto.name,
      category: galleryImageDto.category,
    }).exec();

    expect(newDocs.length).toBe(1);
    expect(newDocs[0].description).toEqual('updated');
  });
});

describe(Endpoints.galleryDelete, () => {
  it('returns HttpStatus.UNAUTHORIZED if not admin', async () => {
    const accessToken = await generateAccessToken(RegisteredUser.email);
    await User.create(RegisteredUser);

    const res = await request(app)
      .post(Endpoints.galleryDelete)
      .set('Cookie', [`accessToken=${accessToken}`]);

    expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    expect(res.body.success).toBe(false);
  });
});

describe(Endpoints.galleryCategoryList, () => {
  it('returns a list of available files', async () => {
    await GalleryImage.insertMany(galleryImageDocs);

    const res = await request(app).get(
      Endpoints.galleryCategoryList.replace(':category', 'acryl')
    );

    const expected = [imagesForGallery[0]];
    expect(res.status).toEqual(HttpStatus.OK);
    expect(res.body.success).toBe(true);
    expect(res.body.images).toEqual(expected);
  });
});
