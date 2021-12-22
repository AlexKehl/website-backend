import { Controller } from '../types';
import { evaluateHttpObject } from '../utils/HttpResponses';
import { ConfirmEmailDto } from '../../common/interface/Dto';
import { confirmEmail } from '../services/Email';

const emailConfirmController: Controller<ConfirmEmailDto> = async ({
  req,
  res,
}) => {
  return evaluateHttpObject(res, await confirmEmail(req.body));
};

export { emailConfirmController };
