import { Schema, model, Document } from 'mongoose';

export interface IFile extends Document {
  path: string;
  name: string;
}

const FileSchema = new Schema({
  path: { type: String, required: true },
  name: { type: String, required: true },
});

export default model<IFile>('File', FileSchema);
