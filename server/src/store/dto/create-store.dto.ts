import { IsString, MaxLength } from 'class-validator';

export class CreateStoreDto {
  @IsString({ message: 'Title required' })
  @MaxLength(100, { message: 'Title is too long' })
  title: string;
}
