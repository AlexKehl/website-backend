import supertest from 'supertest';
import { Endpoints } from '../../common/constants/Endpoints';
import HttpStatus from '../../common/constants/HttpStatus';
import { setupServer, getUniqPort } from '../TestSetupUtils';

const { app } = setupServer({ port: getUniqPort() });

describe(Endpoints.webhook, () => {
  it('returns HttpStatus.BAD_REQUEST if request is unsigned', async () => {
    const res = await supertest(app)
      .post(Endpoints.webhook)
      .send({ fake: 'unsigned request' });

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.error.includes('Webhook Error')).toBe(true);
  });
});
