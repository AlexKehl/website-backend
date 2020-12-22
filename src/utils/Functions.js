const R = require('ramda');

const pipeP = (...fns) => async arg => {
  return fns.reduce(async (acc, currentFunction) => {
    return currentFunction(await acc);
  }, arg);
};

const depsCheck = fnName => deps => obj => {
  if (!R.is(Object, obj)) {
    throw TypeError(`Function ${fnName} requires an object`);
  }
  deps.forEach(dep => {
    if (!obj[dep]) {
      throw TypeError(`Function ${fnName} requires an object property ${dep}`);
    }
  });
  return obj;
};

module.exports = {
  pipeP,
  depsCheck,
};
