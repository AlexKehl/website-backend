import { HttpError, MakeHttpErrorData } from '../../types';
import { makeHttpError } from '../HttpErrors';

export default class WithPayloadError extends Error {
  private payload: HttpError;
  constructor(payload: MakeHttpErrorData) {
    super(payload.data.error);
    Error.captureStackTrace(this, this.constructor);
    this.payload = makeHttpError(payload);
  }

  getPayload() {
    return this.payload;
  }
}
