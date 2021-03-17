const makeHttpResponse = ({ statusCode, data }) => ({
  headers: {
    'Content-Type': 'application/json',
  },
  statusCode,
  data: {
    statusCode,
    data: data,
  },
});

module.exports = { makeHttpResponse };
