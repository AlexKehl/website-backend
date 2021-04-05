import { Schema, model } from 'mongoose';
import { FileDoc } from '../types';

const FileSchema = new Schema({
  path: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  height: { type: Number, required: true },
  width: { type: Number, required: true },
  description: { type: String },
});

export default model<FileDoc>('File', FileSchema);
