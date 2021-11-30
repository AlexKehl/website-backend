import HttpStatus from '../../common/constants/HttpStatus';
import { ContactInformationDto } from '../../common/interface/Dto';
import { User } from '../model/User';
import { makeHttpError } from '../utils/HttpErrors';
import { makeHttpResponse } from '../utils/HttpResponses';

export const updateContactInformation = async (dto: ContactInformationDto) => {
  const { email, ...userData } = dto;
  try {
    await User.updateOne({ email }, { ...userData }).orFail();
    return makeHttpResponse({ statusCode: HttpStatus.OK });
  } catch (e) {
    return makeHttpError({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      data: { error: 'Could not write user data to db' },
    });
  }
};
