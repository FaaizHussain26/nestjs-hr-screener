import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  Address: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  image: string;

  @Prop({ required: true, default: false })
  isActive: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
