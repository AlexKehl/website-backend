import { Schema, model } from 'mongoose';
import { UserDoc } from 'src/types';

const UserSchema = new Schema({
  email: { type: String, required: true },
  refreshToken: { type: String },
  passwordHash: { type: String },
});

export default model<UserDoc>('User', UserSchema);
