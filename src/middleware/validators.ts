import { NextFunction } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { ResultWithContext } from 'express-validator/src/chain';
import HttpStatus from '../../common/constants/HttpStatus';
import { ExpressRequest, ExpressResponse } from '../types';
import { makeHttpError } from '../utils/HttpErrors';

export const validator =
  (
    validationChain:
      | ValidationChain
      | (ValidationChain[] & {
          run: (req: ExpressRequest) => Promise<unknown>;
        })
  ) =>
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    await validationChain.run(req);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const { statusCode, headers, data } = makeHttpError({
        statusCode: HttpStatus.BAD_REQUEST,
        data: {
          error: 'Has wrong fields',
          errors: errors.array(),
        },
      });
      return res.set(headers).status(statusCode).send(data);
    }
    return next();
  };
