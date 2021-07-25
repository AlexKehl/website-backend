import { HttpError } from '../../types';

export default class WithPayloadError extends Error {
  private payload: HttpError;
  constructor({ message, payload }: { message: string; payload: HttpError }) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.payload = payload;
  }

  getPayload() {
    return this.payload;
  }
}
