import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
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

  @Prop({ default: false })
  deleted: boolean;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  likes: mongoose.Types.ObjectId[];

  @Prop([
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ])
  comments: Array<{
    user: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
  }>;

  @Virtual({
    get: function (this: Post) {
      return this.likes?.length || 0;
    },
  })
  likeCount: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.set('toObject', { virtuals: true });
PostSchema.set('toJSON', { virtuals: true });
