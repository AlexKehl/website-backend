import { Schema, model } from 'mongoose';
import { Document } from 'mongoose';

export interface FileDoc {
  name: string;
  category: string;
}

const FileSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
});

export const File = model<FileDoc & Document>('File', FileSchema);
