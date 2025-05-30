import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Logger,
  Request,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { ResponseDto } from 'src/common/reponse.dto';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentDto } from './dto/create-comment.dto';
@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createPostDto: CreatePostDto, @Request() req) {
    const userId = req.user.userId;
    console.log('UserId', userId);

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }
    const data = await this.postsService.create(createPostDto, userId);
    return new ResponseDto('Post created successfully', data);
  }

  @Get()
  async findAll() {
    const data = await this.postsService.findAll();
    return new ResponseDto('Here is your posts', data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.postsService.findOne(id);
    return new ResponseDto('Here is your post', data);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    console.log('aaaaaaa', userId);
    const data = await this.postsService.update(id, updatePostDto, userId);
    return new ResponseDto('Post updated successfully', data);
  }
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    this.logger.log(`Received request to delete post with ID: "${id}"`);
    const data = await this.postsService.delete(id, userId);
    return new ResponseDto('Post deleted successfully', data);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard('jwt'))
  async toggleLike(@Param('id') postId: string, @Request() req) {
    const data = await this.postsService.likePost(postId, req.user.userId);
    return new ResponseDto(
      data.likes.some((user) => user._id.toString() === req.user.userId)
        ? 'Post liked successfully'
        : 'Post unliked successfully',
      data,
    );
  }

  @Post(':id/comments')
  @UseGuards(AuthGuard('jwt'))
  async addComment(
    @Param('id') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    const data = await this.postsService.addComment(
      postId,
      req.user.userId,
      createCommentDto,
    );
    return new ResponseDto('Comment added successfully', data);
  }
  @Get(':id/comments')
  async getComments(
    @Param('id') postId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const data = await this.postsService.getComments(postId, +page, +limit);
    return new ResponseDto('Comments fetched successfully', data);
  }
}
