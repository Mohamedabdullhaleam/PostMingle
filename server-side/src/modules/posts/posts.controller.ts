import { Body, Controller, Post } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { ResponseDto } from 'src/common/reponse.dto';

@Controller('posts')
export class PostsController {
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    console.log('Received post data:', createPostDto);
    return new ResponseDto('Post created (for now)');
  }
}
