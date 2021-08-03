import { Schema, model, SchemaTypes } from 'mongoose';
import { Document } from 'mongoose';
import { TranslatedText } from '../types';

export interface GalleryImageDoc {
  id: string;
  name: string;
  category: string;
  description?: TranslatedText;
  isForSell: boolean;
  price?: number;
}

const GalleryImageSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: SchemaTypes.Mixed },
  isForSell: { type: Boolean, required: true },
  price: { type: Number },
});

export const File = model<GalleryImageDoc & Document>('GalleryImage', GalleryImageSchema);
