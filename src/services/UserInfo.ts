import HttpStatus from '../../common/constants/HttpStatus';
import { ContactInformationDto } from '../../common/interface/Dto';
import { User } from '../model/User';
import { makeHttpError } from '../utils/HttpErrors';
import { makeHttpResponse } from '../utils/HttpResponses';

export const updateContactInformation = async (dto: ContactInformationDto) => {
  const { email, ...userData } = dto;
  try {
    const updateRes = await User.updateOne({ email }, { contact: userData });
    if (updateRes.matchedCount === 0) {
      return makeHttpError({
        statusCode: HttpStatus.NOT_FOUND,
        data: { error: 'User is not registered' },
      });
    }
    return makeHttpResponse({ statusCode: HttpStatus.OK });
  } catch (e) {
    return makeHttpError({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      data: { error: 'Could not write user data to db' },
    });
  }
};
