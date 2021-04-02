import { FileMeta } from './RequestObject';
import { Document } from 'mongoose';

export interface UserDoc extends Document {
  email: UserData['email'];
  refreshToken?: UserData['refreshToken'];
  passwordHash: UserData['passwordHash'];
}

export interface UserData {
  email: string;
  refreshToken?: string;
  passwordHash: string;
}

export interface FileDoc extends Document {
  _id?: string;
  path: string;
  name: string;
  category: string;
  height: number;
  width: number;
  description?: string;
}

export interface FileData extends FileMeta {
  path: string;
}
