import { Schema, model } from 'mongoose';
import { Document } from 'mongoose';
import { Role } from '../../common/interface/Constants';

export interface UserDoc {
  email: string;
  roles: Role[];
  refreshTokenHash?: string;
  passwordHash: string;
  isEmailConfirmed?: boolean;
}

const UserSchemaDefinition: Record<keyof UserDoc, any> = {
  email: { type: String, required: true },
  refreshTokenHash: { type: String },
  passwordHash: { type: String },
  roles: { type: [String], required: true },
  isEmailConfirmed: { type: Boolean, default: false },
};

const UserSchema: Schema = new Schema(UserSchemaDefinition);

export const User = model<UserDoc & Document>('User', UserSchema);
