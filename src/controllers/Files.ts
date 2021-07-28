import { ExpressObj } from '../types';

const fileUploadController = async ({ req, res }: ExpressObj) => {
  console.log(req.body.category);
  // const { headers, statusCode, data } = await uploadFile(req.body);
  // res.set(headers).status(statusCode).send(data);
};

export { fileUploadController };
