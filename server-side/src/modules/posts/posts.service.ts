import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './post.schema';
import mongoose, { isValidObjectId, Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { validateId } from 'src/common/utils/validate-id.util';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    const createdPost = new this.postModel({
      user: userId,
      ...createPostDto,
    });
    return createdPost.save();
  }

  // async findAll(): Promise<Post[]> {
  //   return this.postModel
  //     .find({ deleted: { $ne: true } })
  //     .populate('user', '_id')
  //     .sort({ createdAt: -1 })
  //     .lean()
  //     .exec();
  // }
  async findAll(): Promise<Post[]> {
    return this.postModel
      .find({ deleted: { $ne: true } })
      .populate('user', '_id username email')
      .populate('likes', 'username email')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  //
  async findOne(id: string): Promise<Post> {
    validateId(id);
    const post = await this.postModel
      .findOne({ _id: id, deleted: false })
      .populate('user', '_id username email')
      .populate('likes', 'username email')
      .populate('comments.user', 'username email')
      .exec();

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
  ): Promise<Post> {
    validateId(id);
    await this.checkOwnership(id, userId);
    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, {
        new: true,
        runValidators: true,
        lean: true,
      })
      .exec();
    if (!updatedPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return updatedPost;
  }

  async delete(id: string, userId: string): Promise<string> {
    validateId(id);
    await this.checkOwnership(id, userId);
    this.logger.log(`Deleting post with ID: ${id}`);

    const result = await this.postModel
      .findOneAndUpdate(
        { _id: id, deleted: false },
        { deleted: true },
        { new: true },
      )
      .lean()
      .exec();
    if (!result) {
      this.logger.warn(`Post with ID ${id} not found`);
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    this.logger.debug(`Post with ID ${id} deleted successfully`);
    return `Post with ID ${id} deleted successfully ✔`;
  }

  // Comments and likes
  async likePost(postId: string, userId: string): Promise<Post> {
    validateId(postId);
    validateId(userId);

    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const hasLiked = post.likes.some((likeId) => likeId.equals(userObjectId));

    if (hasLiked) {
      post.likes = post.likes.filter((likeId) => !likeId.equals(userObjectId));
    } else {
      post.likes.push(userObjectId);
    }

    return post
      .save()
      .then((savedPost) => savedPost.populate('likes', 'username email'));
  }
  async addComment(
    postId: string,
    userId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Post> {
    validateId(postId);
    validateId(userId);

    const comment = {
      user: new mongoose.Types.ObjectId(userId),
      content: createCommentDto.content,
      createdAt: new Date(),
    };

    const updatedPost = await this.postModel
      .findByIdAndUpdate(
        postId,
        { $push: { comments: comment } },
        { new: true, runValidators: true },
      )
      .populate('comments.user', 'username email');

    if (!updatedPost) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    return updatedPost;
  }
  async getComments(postId: string, page: number, limit: number) {
    validateId(postId);
    const post = await this.postModel
      .findById(postId)
      .populate('comments.user', 'username email');
    if (!post) throw new NotFoundException('Post not found');
    const comments = post.comments.slice((page - 1) * limit, page * limit);
    return comments.map((comment) => ({
      user: comment.user,
      content: comment.content,
      createdAt: comment.createdAt,
    }));
  }
  async editComment(
    postId: string,
    commentId: string,
    userId: string,
    content: string,
  ): Promise<Post> {
    validateId(postId);
    validateId(commentId);
    validateId(userId);

    const post = await this.postModel
      .findOne({
        _id: postId,
        deleted: false,
        'comments._id': commentId,
      })
      .exec();

    if (!post) {
      throw new NotFoundException('Post or comment not found');
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.user.toString() !== userId) {
      throw new ForbiddenException('You are not allowed to edit this comment');
    }

    comment.content = content;
    comment.updatedAt = new Date();

    await post.save();
    return post.populate('comments.user', 'username email');
  }

  async deleteComment(
    postId: string,
    commentId: string,
    userId: string,
  ): Promise<Post> {
    validateId(postId);
    validateId(commentId);
    validateId(userId);

    const post = await this.postModel
      .findOne({
        _id: postId,
        deleted: false,
        'comments._id': commentId,
      })
      .exec();

    if (!post) {
      throw new NotFoundException('Post or comment not found');
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.user.toString() !== userId) {
      throw new ForbiddenException(
        'You are not allowed to delete this comment',
      );
    }

    comment.deleteOne();
    await post.save();
    return post.populate('comments.user', 'username email');
  }

  async count(): Promise<number> {
    return this.postModel.countDocuments();
  }
  async checkOwnership(postId: string, userId: string): Promise<PostDocument> {
    const post = await this.postModel.findById(postId).exec();
    console.log('OwnerShip', post);

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    if (!post.user) {
      throw new ForbiddenException(
        `Post with ID ${postId} has no user assigned`,
      );
    }
    console.log('Ownership', post.user.toString(), userId);
    if (post.user.toString() !== userId) {
      throw new ForbiddenException(
        'You are not authorized to modify this post',
      );
    }
    return post;
  }
}
