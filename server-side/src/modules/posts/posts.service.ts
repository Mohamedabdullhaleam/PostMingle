import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
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

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const createdPost = new this.postModel(createPostDto);
    return createdPost.save();
  }

  async findAll(): Promise<Post[]> {
    return this.postModel.find().sort({ createdAt: -1 }).lean().exec();
  }

  async findOne(id: string): Promise<Post> {
    validateId(id);
    const post = await this.postModel.findById(id).lean().exec();
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    validateId(id);
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

  async delete(id: string): Promise<string> {
    validateId(id);
    this.logger.log(`Deleting post with ID: ${id}`);
    const result = await this.postModel.findByIdAndDelete(id).lean().exec();
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
}
