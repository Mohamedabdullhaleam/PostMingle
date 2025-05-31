// src/posts/dto/create-comment.dto.ts
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @Length(10, 5000)
  content: string;
}
