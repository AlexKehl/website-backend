const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('src/model/User.js');

const generateAccessToken = ({ email }) =>
  jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '45s' });

const generateRefreshToken = ({ email }) =>
  jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET);

const checkUser = async ({ email, password }) => {
  try {
    const { passwordHash } = await UserModel.findOne({ email });
    return await bcrypt.compare(password, passwordHash);
  } catch (e) {
    return false;
  }
};

const login = async ({ email, password }) => {
  const hasValidCredentials = await checkUser({ email, password });
  if (!hasValidCredentials) {
    throw new Error('http: 401');
  }

  const accessToken = generateAccessToken({ email });
  const refreshToken = generateRefreshToken({ email });
  await UserModel.updateOne({ email }, { refreshToken });
  return { accessToken, refreshToken };
};

const getAccessTokenFromHeader = ({ authorization }) =>
  authorization && authorization.split(' ')[1];

const authenticateToken = headers => {
  const token = getAccessTokenFromHeader(headers);
  if (!token) {
    throw new Error('http: 401');
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

const refreshToken = async ({ email, refreshToken }) => {
  if (!refreshToken) {
    throw new Error('http: 401');
  }
  const userDoc = await UserModel.findOne({ email });
  if (!userDoc.refreshToken) {
    throw new Error('http: 403');
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const accessToken = generateAccessToken({ email });
  return { accessToken };
};

module.exports = {
  checkUser,
  login,
  refreshToken,
  authenticateToken,
  getAccessTokenFromHeader,
};
