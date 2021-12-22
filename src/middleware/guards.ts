import { decode, verify } from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../../config';
import { ExpressRequest, ExpressResponse } from '../types';
import HttpStatus from '../../common/constants/HttpStatus';
import { NextFunction } from 'express';
import { makeHttpError } from '../utils/HttpErrors';
import { Role } from '../../common/interface/Constants';
import { getUserFromToken } from '../utils/Tokens';
import { User } from '../model/User';
import { hasRole } from '../../common/utils/User';

export const hasValidAccessTokenGuard = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  try {
    const decoded = decode(req.cookies.accessToken, {
      json: true,
    });
    if (!decoded?.email) {
      const { statusCode, headers, data } = makeHttpError({
        statusCode: HttpStatus.UNAUTHORIZED,
        data: { error: 'Invalid accessToken' },
      });
      return res.set(headers).status(statusCode).send(data);
    }
    verify(req.cookies.accessToken || '', ACCESS_TOKEN_SECRET);
    return next();
  } catch (e) {
    const { statusCode, headers, data } = makeHttpError({
      statusCode: HttpStatus.UNAUTHORIZED,
      data: { error: 'Invalid accessToken' },
    });
    return res.set(headers).status(statusCode).send(data);
  }
};

export const hasRoleGuard =
  (role: Role) =>
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    const { email } = getUserFromToken(req.cookies.accessToken);
    const user = await User.findOne({ email }).exec();
    if (!hasRole({ user, role })) {
      const { statusCode, headers, data } = makeHttpError({
        statusCode: HttpStatus.UNAUTHORIZED,
        data: { error: 'Missing Role' },
      });
      return res.set(headers).status(statusCode).send(data);
    }

    return next();
  };
