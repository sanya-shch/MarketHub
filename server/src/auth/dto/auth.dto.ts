import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(128, { message: 'Password is too long' })
  @IsString({ message: 'Password is required' })
  password: string;
}
