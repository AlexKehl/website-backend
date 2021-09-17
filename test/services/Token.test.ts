import { asyncTimeout } from '../../common/utils/Functions';
import { getNewAccessToken } from '../../src/services/Token';
import { generateRefreshTokenAndHash, RegisteredUser } from '../fixtures/User';

describe('getNewAccessToken', () => {
  it('returns two different accessTokens', async () => {
    const { refreshToken } = await generateRefreshTokenAndHash(
      RegisteredUser.email
    );

    const res1 = getNewAccessToken(refreshToken);
    await asyncTimeout(1)(undefined);
    const res2 = getNewAccessToken(refreshToken);

    expect(res1.cookies?.[0].val).not.toEqual(res2.cookies?.[0].val);
  });
});
