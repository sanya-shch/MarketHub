import { IsString, MaxLength } from 'class-validator';
import { CreateStoreDto } from './create-store.dto';

export class UpdateStoreDto extends CreateStoreDto {
  @IsString({ message: 'Description required' })
  @MaxLength(1000, { message: 'Description is too long' })
  description: string;
}
