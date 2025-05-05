import { IsString } from 'class-validator';

export class CreateStoreDto {
  @IsString({ message: 'Title required' })
  title: string;
}
