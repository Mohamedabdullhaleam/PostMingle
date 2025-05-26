import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { ResponseDto } from 'src/common/reponse.dto';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './post.schema';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    const data = await this.postsService.create(createPostDto);
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
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    const data = await this.postsService.update(id, updatePostDto);
    return new ResponseDto('Post updated successfully', data);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    console.log('[Post--Controller]', id);
    const data = await this.postsService.delete(id);
    return new ResponseDto('Post deleted successfully', data);
  }
}
