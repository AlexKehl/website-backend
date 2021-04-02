import * as Joi from 'joi';
import loginRequest from 'src/validators/schemas/loginRequest';
import tokenRequest from 'src/validators/schemas/tokenRequest';
import fileUploadRequest from 'src/validators/schemas/fileUploadRequest';
import { Request, Response, NextFunction } from 'express';

const attemptSchema = (schema: Joi.ObjectSchema) => (value: object) => {
  return Joi.attempt(value, schema);
};

const applyValidator = (schema: Joi.ObjectSchema) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    attemptSchema(schema)(req.body);
    next();
  } catch (e) {
    res.sendStatus(400);
  }
};

export const validateLoginReq = applyValidator(loginRequest);
export const validateTokenReq = applyValidator(tokenRequest);
export const validateFileUploadReq = applyValidator(fileUploadRequest);
