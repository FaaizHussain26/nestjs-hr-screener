import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ collection: 'short-listed-candidates' })
export class ShortlistedCandidates extends Document {
  @Prop({ required: false })
  applicant_name: string;

  @Prop({ required: false })
  job_matched: string;

  @Prop({ required: false })
  summary_match: string;

  @Prop({ required: false, type: [String] })
  matched_skills: string[];

  @Prop({ required: false, type: MongooseSchema.Types.Mixed })
  experience: object;

  @Prop({ required: false, type: [String] })
  bonus_matches: string[];

  @Prop({ required: false })
  match_score: number;

  @Prop({ required: false, type: [String] })
  jobs_matched: string[];

  @Prop({ required: false })
  applicant_summary: string;

  @Prop({ required: false })
  applicant_email: string;

  @Prop({ required: false })
  applicant_phone: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  isDuplicated: boolean;

  @Prop({ required: false })
  job_title: string;

  @Prop({ required: false })
  applicant_skills: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ShortlistedSchema = SchemaFactory.createForClass(
  ShortlistedCandidates,
);