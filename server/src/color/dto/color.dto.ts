import { IsString } from 'class-validator';

export class ColorDto {
  @IsString({ message: 'Name required' })
  name: string;

  @IsString({ message: 'Value required' })
  value: string;
}
