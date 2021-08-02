import { getNewAccessToken } from '../../src/services/Token';
import { asyncTimeout } from '../../src/utils/Functions';
import { generateRefreshTokenAndHash, RegisteredUser } from '../fixtures/User';

describe('getNewAccessToken', () => {
  it('returns two different accessTokens', async () => {
    const { refreshToken } = await generateRefreshTokenAndHash(
      RegisteredUser.email
    );

    const res1 = getNewAccessToken(refreshToken);
    await asyncTimeout(1)();
    const res2 = getNewAccessToken(refreshToken);

    expect(res1.data?.accessToken).not.toEqual(res2.data?.accessToken);
  });
});
