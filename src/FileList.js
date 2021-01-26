const fs = require('fs');

const getFileListForCategory = category =>
  fs.readdirSync(`${process.env.FILE_PATH}/${category}`);

module.exports = {
  getFileListForCategory,
};
