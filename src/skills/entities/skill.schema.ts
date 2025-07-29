import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, collection: 'skill' })
export class Skill extends Document {
  @Prop({ require: true })
  technical_skill: string;
}
export const SkillSchema = SchemaFactory.createForClass(Skill);
