import HttpStatus from '../../common/constants/HttpStatus';
import {
  AddressInformationDto,
  ContactInformationDto,
} from '../../common/interface/Dto';
import { updateUser } from '../model/User';
import { makeHttpError } from '../utils/HttpErrors';
import { makeHttpResponse } from '../utils/HttpResponses';

export const updateContactInformation = async (
  dto: ContactInformationDto,
  email: string
) => {
  try {
    await updateUser(email, { contact: dto });
    return makeHttpResponse({ statusCode: HttpStatus.OK });
  } catch (e) {
    return makeHttpError({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      data: { error: 'Could not write user data to db' },
    });
  }
};

export const updateAddressInformation = async (
  dto: AddressInformationDto,
  email: string
) => {
  try {
    await updateUser(email, { address: dto });
    return makeHttpResponse({ statusCode: HttpStatus.OK });
  } catch (e) {
    return makeHttpError({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      data: { error: 'Could not write user data to db' },
    });
  }
};
