const adaptRequest = (req = {}) => {
  return Object.freeze({
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
