import { FileDto, SerializedFileObj, WithBody } from '../types';
import { File } from '../model/File';
import { tryToExecute } from '../utils/HttpErrors';

// const uploadFile = (req: WithBody<FileDto>) => isFileNotExistingInDb(req);

const serializeFileObj = (req: WithBody<FileDto>): SerializedFileObj => {
  const { originalname, buffer, size, mimetype } = req.file!;
  return { ...req.body, originalname, buffer, size, mimetype };
};

// {
//   fieldname: 'file',
//   originalname: 'i-201.jpg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   buffer: <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 02 d0 00 00 01 95 08 06 00 00 00 d7 2a c6 de 00 00 20 00 49 44 41 54 78 9c 54 bd 51 96 24 4b 8e ... 473051 more bytes>,
//   size: 473101
// }

// const isFileNotExistingInDb = async (req: WithBody<FileDto>) => {
//   // return Boolean(await File.findOne({ name, category }));
//
//   tryToExecute<WithBody<FileDto>>({
//     fnToTry: async () => !(await File.findOne({ name: req.file?.originalname, category: req.file. })),
//     httpErrorData: {
//       statusCode: HttpStatus.CONFLICT,
//       data: {
//         error: 'User exists',
//       },
//     },
//     passThrough: ,
//   });
// };
//
// async upload(file: Express.Multer.File, fileUploadDto: FileUploadDto) {
//   if (
//     await isFileExistingInDb(file.originalname, fileUploadDto.category)
//   ) {
//     throw new EntityExistsException("File exists");
//   }
//
//   await this.writeFileToDisk(file, fileUploadDto);
//
//   const createdFile = new this.fileModel({
//     name: file.originalname,
//     category: fileUploadDto.category,
//   });
//   return createdFile.save();
// }
//
// async delete(category: string, name: string) {
//   if (!(await this.isFileExistingInDb(name, category))) {
//     throw new NotFoundException();
//   }
//   return Promise.all([
//     unlink(join(IMAGE_PATH, category, name)),
//     this.fileModel.deleteOne({ category, name }),
//   ]);
// }
//
// async getImagePath(category: string, imageName: string) {
//   if (!this.isImageExistingOnDisk(category, imageName)) {
//     throw new NotFoundException();
//   }
//   return join(category, imageName);
// }
//
// async getImagePathsForCategory(
//   category: string
// ): Promise<ImageForConsumer[]> {
//   const imagesForCategory = await this.fileModel.find({ category }).lean();
//   return imagesForCategory.map(({ name, category }) => ({
//     name,
//     category,
//     url: join(BASE_URL, "files/image", category, name),
//   }));
// }

export { serializeFileObj };
