const Auth = ({ env, Db, jwt }) => {
  const generateAccessToken = user =>
    jwt.sign(user, env.ACCESS_TOKEN_SECRET, { expiresIn: '45s' });

  const generateRefreshToken = user => jwt.sign(user, env.REFRESH_TOKEN_SECRET);

  const login = async ({ email, password }) => {
    const user = {
      email,
    };
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await Db.updateUser({ email, refreshToken });
    return { accessToken, refreshToken };
  };

  const getAccessTokenFromHeader = ({ authorization }) =>
    authorization && authorization.split(' ')[1];

  const authenticateToken = (req, res, next) => {
    const token = getAccessTokenFromHeader(req.headers);
    if (!token) {
      return res.sendStatus(401);
    }
    try {
      const user = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
      req.user = user;
      next();
    } catch (e) {
      res.sendStatus(403);
    }
  };

  const refreshToken = async ({ email, refreshToken }) => {
    if (!refreshToken) {
      return { status: 401 };
    }
    const userDoc = await Db.getUser(email);
    if (!userDoc.refreshToken) {
      return { status: 403 };
    }
    try {
      const user = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);
      const accessToken = generateAccessToken({ email: user.emal });
      return { accessToken };
    } catch (e) {
      return { status: 403 };
    }
  };

  return {
    login,
    refreshToken,
    authenticateToken,
    getAccessTokenFromHeader,
  };
};

module.exports = Auth;
