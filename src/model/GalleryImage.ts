import { Schema, model, SchemaTypes } from 'mongoose';
import { Document } from 'mongoose';
import HttpStatus from '../../common/constants/HttpStatus';
import HttpTexts from '../../common/constants/HttpTexts';
import { Category } from '../../common/interface/Constants';
import { FileDoc } from '../types/Files';
import WithPayloadError from '../utils/Exceptions/WithPayloadError';

export interface GalleryImageDoc extends FileDoc {
  category: Category;
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
  width: { type: Number, required: true },
  height: { type: Number, required: true },
};

const GalleryImageSchema = new Schema(GalleryImageSchemaDefinition);

export const GalleryImage = model<GalleryImageDoc & Document>(
  'GalleryImage',
  GalleryImageSchema
);

export const findGalleryImage = async (
  id: string
): Promise<GalleryImageDoc> => {
  const image = await GalleryImage.findOne({ id }).lean();
  if (!image) {
    throw new WithPayloadError({
      statusCode: HttpStatus.NOT_FOUND,
      data: { error: HttpTexts.imageIsMissing },
    });
  }

  return image;
};
