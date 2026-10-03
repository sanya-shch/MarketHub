import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class ReviewDto {
  @IsString({ message: 'Review text must be a string' })
  @IsNotEmpty({ message: 'Review text is required' })
  @MaxLength(2000, { message: 'Review text is too long' })
  text: string;

  @IsInt({ message: 'Rating must be a whole number' })
  @Min(1, { message: 'Minimum rating is 1' })
  @Max(5, { message: 'Maximum rating is 5' })
  rating: number;
}
