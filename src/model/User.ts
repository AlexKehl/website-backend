import { Schema, model } from 'mongoose';
import { UserDoc } from '../types';

const UserSchema = new Schema({
  email: { type: String, required: true },
  refreshTokenHash: { type: String },
  passwordHash: { type: String },
});

export default model<UserDoc>('User', UserSchema);
