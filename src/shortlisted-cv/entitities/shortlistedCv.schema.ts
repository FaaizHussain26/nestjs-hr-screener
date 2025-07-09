import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseMongoEntity } from 'src/common/entities/base.schema';


export type ShortlistedCvDocument = ShortlistedCv & Document;

@Schema({ timestamps: true, collection: 'ShortlistedCvSchema'  })
export class ShortlistedCv extends BaseMongoEntity  {
 @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  position: string;

  @Prop({ required: true })
  experience: number;

  @Prop({ required: true, type: [String] })
  skills: string[];

  @Prop({ required: true })
  education: string;

  @Prop({ required: true })
  resumeLink: string;

}

export const ShortlistedCvSchema = SchemaFactory.createForClass(ShortlistedCv);
