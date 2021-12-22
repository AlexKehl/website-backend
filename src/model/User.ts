import { Schema, model } from 'mongoose';
import { Document } from 'mongoose';
import HttpStatus from '../../common/constants/HttpStatus';
import HttpTexts from '../../common/constants/HttpTexts';
import { User as UserType } from '../../common/interface/ConsumerResponses';
import WithPayloadError from '../utils/Exceptions/WithPayloadError';
import { makeHttpError } from '../utils/HttpErrors';

export interface UserDoc extends UserType {
  _isEmailConfirmed?: boolean;
  _passwordHash: string;
}

const UserSchemaDefinition: Record<keyof UserDoc, any> = {
  email: { type: String, required: true },
  _passwordHash: { type: String },
  roles: { type: [String], required: true },
  _isEmailConfirmed: { type: Boolean, default: false },
  contact: {
    email: { type: String },
    phone: { type: String },
    countryCode: { type: String },
    firstName: { type: String },
    lastName: { type: String },
  },
  address: {
    fullName: { type: String },
    street: { type: String },
    streetNumber: { type: String },
    city: { type: String },
    stateCode: { type: String },
    zip: { type: String },
    countryCode: { type: String },
    commentary: { type: String },
  },
};

const UserSchema: Schema = new Schema(UserSchemaDefinition);

export const User = model<UserDoc & Document>('User', UserSchema);

export const findUser = async (email: string): Promise<UserDoc> => {
  const user = await User.findOne({ email }).lean()!;
  if (!user) {
    throw new WithPayloadError({
      statusCode: HttpStatus.NOT_FOUND,
      data: { error: HttpTexts.userNotExisting },
    });
  }

  return user;
};

export const updateUser = async (email: string, data: Partial<UserDoc>) => {
  const updateRes = await User.updateOne({ email }, data);
  if (updateRes.matchedCount === 0) {
    throw new WithPayloadError({
      statusCode: HttpStatus.NOT_FOUND,
      data: { error: HttpTexts.userNotExisting },
    });
  }

  return updateRes;
};
