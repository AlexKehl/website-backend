import {
  AddressInformationDto,
  ContactInformationDto,
} from '../../common/interface/Dto';
import {
  updateAddressInformation,
  updateContactInformation,
} from '../services/UserInfo';
import { Controller } from '../types';
import { evaluateHttpObject } from '../utils/HttpResponses';
import { getUserFromToken } from '../utils/Tokens';

export const postContactInformationController: Controller<ContactInformationDto> =
  async ({ req, res }) => {
    const { email } = getUserFromToken(req.cookies.accessToken);
    return evaluateHttpObject(
      res,
      await updateContactInformation(req.body, email)
    );
  };

export const postAddressInformationController: Controller<AddressInformationDto> =
  async ({ req, res }) => {
    const { email } = getUserFromToken(req.cookies.accessToken);
    return evaluateHttpObject(
      res,
      await updateAddressInformation(req.body, email)
    );
  };
