import HttpStatus from '../../common/constants/HttpStatus';
import { User as UserType } from '../../common/interface/ConsumerResponses';
import { User } from '../model/User';
import { makeHttpError } from '../utils/HttpErrors';
import { makeHttpResponse } from '../utils/HttpResponses';

export const getUserInfo = async (email: string) => {
  const res = await User.findOne({ email })
    .select('-__v -_id -passwordHash -refreshTokenHash')
    .lean();
  if (!res) {
    return makeHttpError({
      statusCode: HttpStatus.NOT_FOUND,
      data: {
        error: 'User not found',
      },
    });
  }
  return makeHttpResponse({
    statusCode: HttpStatus.OK,
    data: res as UserType,
  });
};
