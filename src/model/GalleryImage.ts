import { Schema, model, SchemaTypes } from 'mongoose';
import { Document } from 'mongoose';
import { FileDoc } from '../types/Files';

export interface GalleryImageDoc extends FileDoc {
  category: string;
  isForSell: boolean;
  price?: number;
}

const GalleryImageSchemaDefinition: Record<keyof GalleryImageDoc, any> = {
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: SchemaTypes.Mixed },
  isForSell: { type: Boolean, required: true },
  price: { type: Number },
};

const GalleryImageSchema = new Schema(GalleryImageSchemaDefinition);

export const GalleryImage = model<GalleryImageDoc & Document>(
  'GalleryImage',
  GalleryImageSchema
);
