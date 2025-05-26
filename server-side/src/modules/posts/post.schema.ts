import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: false })
  image?: string;

  //   @Prop({ required: true })
  //   author: string; // You can later replace this with a reference to User schema
}

export const PostSchema = SchemaFactory.createForClass(Post);
