const adaptRequest = (req = {}) => {
  return Object.freeze({
    headers: req.headers,
    path: req.path,
    method: req.method,
    pathParams: req.params,
    queryParams: req.query,
    body: req.body,
    file: req?.files?.image,
  });
};

module.exports = {
  adaptRequest,
};
