import { ExpressObj, ImageWithMeta, Role } from '../types';
import WithPayloadError from '../utils/Exceptions/WithPayloadError';
import HttpStatus from '../utils/HttpStatus';
import { getEmailFromToken } from '../utils/Tokens';
import { hasRole } from '../utils/UserUtils';

const hasFileMeta = (role: Role) => async (
  expressObj: ExpressObj<ImageWithMeta>
) => {};

export { hasFileMeta };
