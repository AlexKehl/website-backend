import { Schema, model } from 'mongoose';
import { Document } from 'mongoose';

export interface FileDoc {
  _id?: string;
  path: string;
  name: string;
  category: string;
  height: number;
  width: number;
  description?: string;
}

const FileSchema = new Schema({
  path: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  height: { type: Number, required: true },
  width: { type: Number, required: true },
  description: { type: String },
});

export const File = model<FileDoc & Document>('File', FileSchema);
