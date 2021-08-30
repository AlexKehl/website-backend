import { verify } from 'jsonwebtoken';
import HttpStatus from '../../common/constants/HttpStatus';
import HttpTexts from '../../common/constants/HttpTexts';
import { ConfirmEmailDto } from '../../common/interface/Dto';
import { EMAIL_VERIFICATION_SECRET } from '../../config';
import { HttpError, HttpResponse } from '../types';
import WithPayloadError from '../utils/Exceptions/WithPayloadError';
import { makeHttpResponse } from '../utils/HttpResponses';
import { findUser, markEmailAsConfirmed } from './Users';

const decodeConfirmationToken = (token: string): string => {
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
  } catch (e) {
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

const confirmEmail = async ({
  token,
}: ConfirmEmailDto): Promise<HttpResponse | HttpError> => {
  const email = decodeConfirmationToken(token);

  const user = await findUser(email);
  if (!user) {
    throw new WithPayloadError({
      statusCode: HttpStatus.BAD_REQUEST,
      data: {
        error: HttpTexts.userNotExisting,
      },
    });
  }
  if (user?.isEmailConfirmed) {
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

export { decodeConfirmationToken, confirmEmail };
