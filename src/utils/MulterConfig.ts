import { Request } from 'express';
import { FileFilterCallback, memoryStorage } from 'multer';
const multer = require('multer'); // es6 import does not work

export const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith('image')) return cb(null, true);

  cb(new Error('Please upload only images'));
};

const storage = memoryStorage();

export default multer({ storage /* fileFilter: multerFilter  */ });
