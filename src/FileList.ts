import * as fs from 'fs';

const getFileListForCategory = (category: string) =>
  fs.readdirSync(`${process.env.FILE_PATH}/${category}`);

export { getFileListForCategory };
