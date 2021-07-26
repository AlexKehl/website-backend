import { User } from '../../src/model/User';
import { login, register } from '../../src/services/Auth';
import { makeHttpError } from '../../src/utils/HttpError';
import { makeHttpResponse } from '../../src/utils/HttpResponse';
import HttpStatus from '../../src/utils/HttpStatus';
import { setupDb } from '../TestSetupUtils';
import { RegisteredUser, UserWithPassword } from '../fixtures/User';

setupDb();

describe('register', () => {
  it('creates a user entry in db', async () => {
    const res = await register(UserWithPassword);

    const isUserExisting = Boolean(
      await User.findOne({ email: UserWithPassword.email })
    );

    expect(res).toEqual(makeHttpResponse({ statusCode: HttpStatus.CREATED }));
    expect(isUserExisting).toBe(true);
  });

  it('returns an error if user exists with this email', async () => {
    const createdUser = new User({ email: UserWithPassword.email });
    await createdUser.save();

    const res = await register(UserWithPassword);

    const expected = makeHttpError({
      statusCode: HttpStatus.CONFLICT,
      data: {
        error: 'User exists',
      },
    });
    expect(res).toEqual(expected);
  });
});

describe('login', () => {
  it('returns access and refresh token on login', async () => {
    const { email, passwordHash } = RegisteredUser;
    const { password } = UserWithPassword;
    const createdUser = new User({ email, passwordHash });
    await createdUser.save();

    const res = await login({ email, password });

    expect(typeof res.data?.accessToken).toBe('string');
    expect(typeof res.data?.refreshToken).toBe('string');
  });

  it('returns error obj if user is not present', async () => {
    const { email, password } = UserWithPassword;

    const res = await login({ email, password });

    const expected = makeHttpError({
      statusCode: HttpStatus.UNAUTHORIZED,
      data: {
        error: 'Invalid Credentials',
      },
    });

    expect(res).toEqual(expected);
  });

  it('returns error obj for wrong credentials', async () => {
    const { email, passwordHash } = RegisteredUser;
    const createdUser = new User({ email, passwordHash });
    await createdUser.save();

    const res = await login({ email, password: 'foobarxy' });

    const expected = makeHttpError({
      statusCode: HttpStatus.UNAUTHORIZED,
      data: {
        error: 'Invalid Credentials',
      },
    });

    expect(res).toEqual(expected);
  });
});
