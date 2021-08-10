import { Role } from '../../common/interface/Constants';
import { hasRole } from '../../common/utils/User';
import { User } from '../model/User';
import { ExpressObj } from '../types';
import WithPayloadError from '../utils/Exceptions/WithPayloadError';
import HttpStatus from '../../common/constants/HttpStatus';
import { getUserFromToken } from '../utils/Tokens';

const hasRoleGuard = (role: Role) => async (expressObj: ExpressObj) => {
  const { email } = getUserFromToken(expressObj.req.cookies.accessToken);
  const user = await User.findOne({ email }).exec();
  if (!hasRole({ user, role })) {
    throw new WithPayloadError({
      data: { error: 'Missing Role' },
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }

  return expressObj;
};

export { hasRoleGuard };
