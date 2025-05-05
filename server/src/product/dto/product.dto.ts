import { ArrayMinSize, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductDto {
  @IsString({ message: 'Title required' })
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: string;

  @IsString({ message: 'Description required' })
  @IsNotEmpty({ message: 'Description cannot be empty' })
  description: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @IsNotEmpty({ message: 'Price cannot be empty' })
  price: number;

  @IsString({ message: 'Please specify at least one image', each: true })
  @ArrayMinSize(1, { message: 'Must be at least one image' })
  @IsNotEmpty({ message: 'Image path cannot be empty', each: true })
  images: string[];

  @IsString({ message: 'Category required' })
  @IsNotEmpty({ message: 'Category ID cannot be empty' })
  categoryId: string;

  @IsString({ message: 'Color required' })
  @IsNotEmpty({ message: 'Color ID cannot be empty' })
  colorId: string;
}
