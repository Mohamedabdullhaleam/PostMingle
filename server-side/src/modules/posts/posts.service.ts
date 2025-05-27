import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './post.schema';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { validateId } from 'src/common/utils/validate-id.util';

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

  async findAll(): Promise<Post[]> {
    return this.postModel
      .find()
      .populate('user', '_id')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async findOne(id: string): Promise<Post> {
    validateId(id);
    const post = await this.postModel.findById(id).lean().exec();
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
      .findByIdAndUpdate(id, { deleted: true })
      .lean()
      .exec();
    if (!result) {
      this.logger.warn(`Post with ID ${id} not found`);
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    this.logger.debug(`Post with ID ${id} deleted successfully`);
    return `Post with ID ${id} deleted successfully ✔`;
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
