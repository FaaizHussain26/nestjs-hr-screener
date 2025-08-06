import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Job extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  experience: string;

  @Prop()
  summary?: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({
    type: [Number],
    index: false
  })
  titleVector?: number[];

  @Prop({
    type: [Number],
    index: false
  })
  descriptionVector?: number[];

  @Prop({
    type: [Number],
    index: false
  })
  skillsVector?: number[];

  @Prop({
    type: [Number],
    index: false
  })
  combinedVector?: number[];

  @Prop({ type: Object, default: {} })
  vectorMetadata?: {
    model?: string;
    lastUpdated?: Date;
    dimensions?: number;
    [key: string]: any;
  };
}

export const JobSchema = SchemaFactory.createForClass(Job);