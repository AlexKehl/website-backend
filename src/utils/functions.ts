const pipeP = (...fns) => async arg => {
  return fns.reduce(async (acc, currentFunction) => {
    return currentFunction(await acc);
  }, arg);
};

module.exports = {
  pipeP,
};
