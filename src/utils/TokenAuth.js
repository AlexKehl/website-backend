const jwt = require('jsonwebtoken');
const { makeHttpError } = require('src/utils/HttpError');

const getAccessTokenFromHeader = ({ authorization } = {}) =>
  authorization && authorization.split(' ')[1];

const authenticateToken = ({ headers, ...rest }) => {
  const token = getAccessTokenFromHeader(headers);
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return { headers, ...rest };
  } catch (e) {
    return makeHttpError({
      statusCode: 403,
      error: 'Invalid accessToken ',
    });
  }
};

const withTokenAuth = fn => requestData => {
  const tokenError = authenticateToken(requestData);
  if (tokenError?.data?.error) {
    return tokenError;
  }
  return fn();
};

module.exports = {
  getAccessTokenFromHeader,
  authenticateToken,
  withTokenAuth,
};
