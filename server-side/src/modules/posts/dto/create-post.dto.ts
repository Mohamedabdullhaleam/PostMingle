import {
  IsNotEmpty,
  IsString,
  IsOptional,
  Length,
  IsUrl,
} from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  @Length(5, 100, { message: 'Title must be between 5 and 100 characters' })
  title: string;

  @IsNotEmpty({ message: 'Content is required' })
  @IsString()
  @Length(10, 5000, {
    message: 'Content must be between 10 and 500 characters',
  })
  content: string;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Image must be a valid URL' })
  image?: string;
}
