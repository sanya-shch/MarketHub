import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

// Images are uploaded through POST /files (see FileService), so only paths of
// that shape are accepted: no external URLs, no `javascript:` and similar.
const UPLOADED_IMAGE =
  /^\/uploads\/products\/[0-9a-f-]{36}\.(jpg|png|gif|webp)$/;

export class ProductDto {
  @IsString({ message: 'Title required' })
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @MaxLength(150, { message: 'Title is too long' })
  title: string;

  @IsString({ message: 'Description required' })
  @IsNotEmpty({ message: 'Description cannot be empty' })
  @MaxLength(5000, { message: 'Description is too long' })
  description: string;

  @IsInt({ message: 'Price must be a whole number' })
  @Min(1, { message: 'Price must be at least 1' })
  @Max(10_000_000, { message: 'Price is too large' })
  price: number;

  @IsArray({ message: 'Please specify at least one image' })
  @ArrayMinSize(1, { message: 'Must be at least one image' })
  @ArrayMaxSize(10, { message: 'Too many images' })
  @IsString({ message: 'Image path must be a string', each: true })
  @Matches(UPLOADED_IMAGE, {
    message: 'Image must be a file uploaded to this shop',
    each: true,
  })
  images: string[];

  @IsString({ message: 'Category required' })
  @IsNotEmpty({ message: 'Category ID cannot be empty' })
  categoryId: string;

  @IsString({ message: 'Color required' })
  @IsNotEmpty({ message: 'Color ID cannot be empty' })
  colorId: string;
}
