import { Role } from '../../../common/interface/Constants';
import { ExpressObj } from '../types';
import WithPayloadError from '../utils/Exceptions/WithPayloadError';
import HttpStatus from '../utils/HttpStatus';
import { getEmailFromToken } from '../utils/Tokens';
import { hasRole } from '../utils/UserUtils';

const hasRoleGuard = (role: Role) => async (expressObj: ExpressObj) => {
  const email = getEmailFromToken(expressObj.req.cookies.accessToken);
  if (!(await hasRole(email, role))) {
    throw new WithPayloadError({
      data: { error: 'Missing Role' },
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }

  return expressObj;
};

export { hasRoleGuard };
