import { sign } from 'jsonwebtoken';
import {
  EMAIL_TOKEN_EXPRATION_TIME,
  EMAIL_VERIFICATION_SECRET,
} from '../../config';

export const generateEmailToken = (email: string) => {
  return sign({ email }, EMAIL_VERIFICATION_SECRET, {
    expiresIn: EMAIL_TOKEN_EXPRATION_TIME,
  });
};

export const generateExpiredEmailToken = (email: string) => {
  return sign({ email }, EMAIL_VERIFICATION_SECRET, {
    expiresIn: '0s',
  });
};

export const generateTokenWithNoEmail = () => {
  return sign({ foo: 'bar' }, EMAIL_VERIFICATION_SECRET, {
    expiresIn: EMAIL_TOKEN_EXPRATION_TIME,
  });
};
