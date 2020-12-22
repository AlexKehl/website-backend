const { UploadedFile } = require('express-fileupload');

const moveFile = path => async file => {
  await file.mv(path);
};

const moveFiles = async (files, path) => {
  const movePromises = files.map(moveFile(path));
  await Promise.all(movePromises);
};

module.exports = { moveFile, moveFiles };
