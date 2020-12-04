const refreshTokens = [];

const Auth = ({ env, itemsDb, jwt }) => {
  const generateAccessToken = user =>
    jwt.sign(user, env.ACCESS_TOKEN_SECRET, { expiresIn: '45s' });

  const login = async (req, res) => {
    const user = {
      email: 123,
    };
    const username = req.body.email;
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    res.json({ accessToken, refreshToken });
  };

  const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const [, token] = authHeader && authHeader.split(' ');
    if (!token) {
      return res.sendStatus(401);
    }
    try {
      const user = await jwt.verify(token, env.ACCESS_TOKEN_SECRET);
      req.user = user;
      next();
    } catch (e) {
      res.sendStatus(403);
    }
  };

  const refreshToken = async (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken) {
      return res.sendStatus(401);
    }
    if (!refreshTokens.includes(refreshToken)) {
      return res.sendStatus(403);
    }
    try {
      const user = await jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);
      const accessToken = generateAccessToken({ email: user.emal });
      res.json({ accessToken });
    } catch (e) {
      return res.sendStatus(403);
    }
  };

  return {
    login,
    refreshToken,
    authenticateToken,
  };
};

module.exports = Auth;
