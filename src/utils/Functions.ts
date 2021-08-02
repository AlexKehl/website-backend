const asyncTimeout = (timeInMs: number) => <T>(val?: T) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(val), timeInMs);
  });
};

export { asyncTimeout };
