import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  refreshToken?: string;
  passwordHash?: string;
  password?: string;
}

const UserSchema = new Schema({
  email: { type: String, required: true },
  refreshToken: { type: String },
  passwordHash: { type: String },
});

export default model<IUser>('User', UserSchema);
