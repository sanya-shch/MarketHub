import { IsString, MaxLength } from 'class-validator';

export class CategoryDto {
  @IsString({ message: 'Title required' })
  @MaxLength(100, { message: 'Title is too long' })
  title: string;

  @IsString({ message: 'Description required' })
  @MaxLength(1000, { message: 'Description is too long' })
  description: string;
}
