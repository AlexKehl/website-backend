import { Schema, model } from 'mongoose';
import { Document } from 'mongoose';
import { User as UserType } from '../../common/interface/ConsumerResponses';

export interface UserDoc extends UserType {
  _isEmailConfirmed?: boolean;
  _refreshTokenHash?: string;
  _passwordHash: string;
}

const UserSchemaDefinition: Record<keyof UserDoc, any> = {
  email: { type: String, required: true },
  _refreshTokenHash: { type: String },
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
