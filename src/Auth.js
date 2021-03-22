const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('src/model/User.js');
const { makeHttpError } = require('src/utils/HttpError');
const { makeHttpResponse } = require('src/utils/HttpResponse');

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

const login = async ({ body }) => {
  const { email, password } = body;
  const hasValidCredentials = await checkUser({ email, password });

  if (!hasValidCredentials) {
    return makeHttpError({
      statusCode: 401,
      error: 'Invalid Credentials',
    });
  }

  const accessToken = generateAccessToken({ email });
  const refreshToken = generateRefreshToken({ email });
  await UserModel.updateOne({ email }, { refreshToken });

  return makeHttpResponse({
    statusCode: 200,
    data: {
      accessToken,
      refreshToken,
    },
  });
};

const refreshToken = async ({ body }) => {
  const { email, refreshToken } = body;

  const user = await UserModel.findOne({ email });

  if (!user?.refreshToken) {
    return makeHttpError({
      statusCode: 401,
      error: 'No refreshToken stored',
    });
  }
  if (refreshToken !== user.refreshToken) {
    return makeHttpError({
      statusCode: 403,
      error: 'Invalid refreshToken',
    });
  }

  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (e) {
    return makeHttpError({
      statusCode: 403,
      error: 'Invalid refreshToken',
    });
  }

  return makeHttpResponse({
    statusCode: 200,
    data: {
      accessToken: generateAccessToken({ email }),
    },
  });
};

module.exports = {
  checkUser,
  login,
  refreshToken,
};
