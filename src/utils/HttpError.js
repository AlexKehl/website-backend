const makeHttpError = ({ statusCode, error }) => ({
  headers: {
    'Content-Type': 'application/json',
  },
  statusCode,
  data: {
    success: false,
    error,
  },
});

module.exports = { makeHttpError };
