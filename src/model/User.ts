import { Schema, model } from 'mongoose';
import { Document } from 'mongoose';

export interface UserDoc {
  email: string;
  refreshTokenHash: string;
  passwordHash: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true },
  refreshTokenHash: { type: String },
  passwordHash: { type: String },
});

export const User = model<UserDoc & Document>('User', UserSchema);
