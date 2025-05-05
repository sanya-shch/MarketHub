import { IsString } from 'class-validator';

export class CategoryDto {
  @IsString({ message: 'Title required' })
  title: string;

  @IsString({ message: 'Description required' })
  description: string;
}
