import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true, collection: 'short-listed-candidates' })
export class ShortlistedCandidates extends Document {
  @Prop({ required: false })
  applicant_name: string;

  @Prop({ required: false })
  job_matched: string;

  @Prop({ required: false })
  summary_match: string;

  @Prop({ required: false, type: [String] })
  matched_skills: string[];

  @Prop({ required: false ,type: MongooseSchema.Types.Mixed  })
  experience: object;

  @Prop({ required: false, type: [String] })
  bonus_matches: string[];

  @Prop({ required: false })
  match_score: number;

  @Prop({ required: false , type: [String]})
  jobs_matched: string[];

  @Prop({ required: false })
  applicant_summary: string;

  @Prop({ required: false })
  applicant_email: string;

  @Prop({ required: false })
  applicant_phone: string;
}

export const ShortlistedSchema = SchemaFactory.createForClass(
  ShortlistedCandidates,
);
