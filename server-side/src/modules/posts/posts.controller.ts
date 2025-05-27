import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Logger,
  Request,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { ResponseDto } from 'src/common/reponse.dto';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createPostDto: CreatePostDto, @Request() req) {
    const userId = req.user._id;
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
    const userId = req.user._id;
    const data = await this.postsService.update(id, updatePostDto, userId);
    return new ResponseDto('Post updated successfully', data);
  }
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: string, @Request() req) {
    const userId = req.user._id;
    this.logger.log(`Received request to delete post with ID: "${id}"`);
    const data = await this.postsService.delete(id, userId);
    return new ResponseDto('Post deleted successfully', data);
  }
}
