import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { User } from 'src/modules/users/models/users.model';

export class CreateLinkDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  short_link: string;

  @ApiProperty()
  hash_link: string;

  @ApiProperty()
  numbers_clicks: number;

  @ApiProperty()
  // @IsString()
  @IsOptional()
  surname?: string;

  @ApiProperty()
  user: User;

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  @IsString()
  original_link: string;
}
