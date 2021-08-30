import HttpStatus from '../../common/constants/HttpStatus';
import HttpTexts from '../../common/constants/HttpTexts';
import { USER_EMAIL } from '../../common/fixtures/User';
import { decodeConfirmationToken } from '../../src/services/Email';
import WithPayloadError from '../../src/utils/Exceptions/WithPayloadError';
import {
  generateEmailToken,
  generateExpiredEmailToken,
  generateTokenWithNoEmail,
} from '../fixtures/Tokens';

describe('decodeConfirmationToken', () => {
  it('throws 400 HttpError if token is malformed', () => {
    const expected = new WithPayloadError({
      statusCode: HttpStatus.BAD_REQUEST,
      data: {
        error: HttpTexts.badConfirmationToken,
      },
    });

    expect(() => {
      decodeConfirmationToken('foo');
    }).toThrow(expected);
  });

  it('returns 400 HttpError if token is expired', () => {
    const expected = new WithPayloadError({
      statusCode: HttpStatus.BAD_REQUEST,
      data: {
        error: HttpTexts.emailTokenExpired,
      },
    });

    expect(() => {
      const expiredToken = generateExpiredEmailToken(USER_EMAIL);
      decodeConfirmationToken(expiredToken);
    }).toThrow(expected);
  });

  it('returns 400 HttpError if email is not inside token', () => {
    const expected = new WithPayloadError({
      statusCode: HttpStatus.BAD_REQUEST,
      data: {
        error: HttpTexts.badConfirmationToken,
      },
    });

    expect(() => {
      const expiredToken = generateTokenWithNoEmail();
      decodeConfirmationToken(expiredToken);
    }).toThrow(expected);
  });

  it('returns the email if token is valid', () => {
    const expiredToken = generateEmailToken(USER_EMAIL);
    const res = decodeConfirmationToken(expiredToken);

    expect(res).toEqual(USER_EMAIL);
  });
});
