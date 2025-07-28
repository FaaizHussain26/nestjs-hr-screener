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
}

export const JobSchema = SchemaFactory.createForClass(Job);
