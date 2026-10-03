import { IsString, Matches, MaxLength } from 'class-validator';

export class ColorDto {
  @IsString({ message: 'Name required' })
  @MaxLength(50, { message: 'Name is too long' })
  name: string;

  @IsString({ message: 'Value required' })
  // used as a CSS color: names, #hex, rgb()/hsl(); no url(), no ';' and so on
  @Matches(/^[#a-zA-Z0-9(),.%\s-]{1,40}$/, {
    message: 'Value must be a CSS color, e.g. #ff0000 or red',
  })
  value: string;
}
