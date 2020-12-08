import { compare } from 'bcrypt';
import { IncomingHttpHeaders } from 'http';
import { User } from './types';

const Auth = ({ env, Db, jwt }) => {
  const generateAccessToken = (user: { email: string }) =>
    jwt.sign(user, env.ACCESS_TOKEN_SECRET, { expiresIn: '45s' });

  const generateRefreshToken = (user: { email: string }) =>
    jwt.sign(user, env.REFRESH_TOKEN_SECRET);

  const checkUser = async ({ email, password }: User) => {
    try {
      const { passwordHash } = await Db.getUser(email);
      return await compare(password, passwordHash);
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const login = async ({ email, password }) => {
    const hasValidCredentials = await checkUser({ email, password });
    if (!hasValidCredentials) {
      throw { status: 401 };
    }
    const user = {
      email,
    };
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await Db.updateUser({ email, refreshToken });
    return { accessToken, refreshToken };
  };

  const getAccessTokenFromHeader = ({ authorization }: IncomingHttpHeaders) =>
    authorization && authorization.split(' ')[1];

  const authenticateToken = (headers: IncomingHttpHeaders) => {
    const token = getAccessTokenFromHeader(headers);
    if (!token) {
      throw new Error('http: 401');
    }
    jwt.verify(token, env.ACCESS_TOKEN_SECRET);
  };

  const refreshToken = async ({ email, refreshToken }) => {
    if (!refreshToken) {
      throw new Error('http: 401');
    }
    const userDoc = await Db.getUser(email);
    if (!userDoc.refreshToken) {
      throw new Error('http: 403');
    }
    const user = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);
    const accessToken = generateAccessToken({ email: user.emal });
    return { accessToken };
  };

  return {
    checkUser,
    login,
    refreshToken,
    authenticateToken,
    getAccessTokenFromHeader,
  };
};

export default Auth;
