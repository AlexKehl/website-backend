const asyncTimeout = (timeInMs: number) => <T>(val?: T) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(val), timeInMs);
  });
};

const log = <T>(val: T): T => {
  console.log(val);
  return val;
};

export { asyncTimeout, log };
