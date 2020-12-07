const jwt = require('jsonwebtoken');

const main = async () => {
  try {
    const res = jwt.verify(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IjEyMyIsImlhdCI6MTYwNzM2MDgxMiwiZXhwIjoxNjA3MzYwODU3fQ.UO3xIjz2eecgg7urfN9R9EO5XbXykohsa-YJq78ld8A',
      '9c1cbba397041f531da6616430c4cf3f40f3834c2c0ac4492b9373e7c6af15693b717796aa2241179d23c96b37c6c8ed4eaa376966b7f19551e5e6becf786008',
    );
    console.log(res);
  } catch (e) {
    console.log('jo', e);
  }
};

main();
