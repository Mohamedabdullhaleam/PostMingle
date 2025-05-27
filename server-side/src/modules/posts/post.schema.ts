import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../users/user.schema';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: false })
  image?: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
