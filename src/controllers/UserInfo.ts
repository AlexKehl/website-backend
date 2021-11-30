import { ContactInformationDto } from '../../common/interface/Dto';
import { updateContactInformation } from '../services/UserInfo';
import { Controller } from '../types';
import { evaluateHttpObject } from '../utils/HttpResponses';

export const contactInformationController: Controller<ContactInformationDto> =
  async ({ req, res }) => {
    evaluateHttpObject(res, await updateContactInformation(req.body));
  };
