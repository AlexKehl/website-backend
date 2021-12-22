import { sign, verify } from 'jsonwebtoken';
import { createTransport } from 'nodemailer';
import HttpStatus from '../../common/constants/HttpStatus';
import HttpTexts from '../../common/constants/HttpTexts';
import { ConfirmEmailDto } from '../../common/interface/Dto';
import {
  EMAIL_CONFIRMATION_URL,
  EMAIL_PASSWORD,
  EMAIL_TOKEN_EXPRATION_TIME,
  EMAIL_USER,
  EMAIL_VERIFICATION_SECRET,
} from '../../config';
import { findUser } from '../model/User';
import { PaymentSuccess } from '../templates/mail/PaymentSuccess';
import { HttpError, HttpResponse } from '../types';
import WithPayloadError from '../utils/Exceptions/WithPayloadError';
import { makeHttpResponse } from '../utils/HttpResponses';
import { markEmailAsConfirmed } from './Users';

const nodemailerTransport = createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

export const decodeConfirmationToken = (token: string): string => {
  try {
    const payload = verify(token || '', EMAIL_VERIFICATION_SECRET) as any;

    if (!payload?.email) {
      throw new WithPayloadError({
        statusCode: HttpStatus.BAD_REQUEST,
        data: {
          error: HttpTexts.badConfirmationToken,
        },
      });
    }

    return payload.email;
  } catch (e: any) {
    if (e?.name === 'TokenExpiredError') {
      throw new WithPayloadError({
        statusCode: HttpStatus.BAD_REQUEST,
        data: {
          error: HttpTexts.emailTokenExpired,
        },
      });
    }
    throw new WithPayloadError({
      statusCode: HttpStatus.BAD_REQUEST,
      data: {
        error: HttpTexts.badConfirmationToken,
      },
    });
  }
};

export const sendVerificationLink = (email: string) => {
  const payload = { email };

  const token = sign(payload, EMAIL_VERIFICATION_SECRET, {
    expiresIn: EMAIL_TOKEN_EXPRATION_TIME,
  });
  const url = `${EMAIL_CONFIRMATION_URL}?token=${token}`;
  const text = `${HttpTexts.emailConfirmText}${url}`;

  return nodemailerTransport.sendMail({
    to: email,
    subject: HttpTexts.emailSubject,
    text,
  });
};

export const sendSuccessfullPaymentEmail = (email: string) => {
  return nodemailerTransport.sendMail({
    to: email,
    subject: HttpTexts.paymentSubject,
    html: PaymentSuccess,
  });
};

export const confirmEmail = async ({
  token,
}: ConfirmEmailDto): Promise<HttpResponse | HttpError> => {
  const email = decodeConfirmationToken(token);

  const user = await findUser(email);

  if (user._isEmailConfirmed) {
    throw new WithPayloadError({
      statusCode: HttpStatus.BAD_REQUEST,
      data: {
        error: HttpTexts.emailAlreadyConfirmed,
      },
    });
  }
  await markEmailAsConfirmed(email);
  return makeHttpResponse({ statusCode: HttpStatus.OK });
};
