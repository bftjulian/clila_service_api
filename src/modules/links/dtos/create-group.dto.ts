import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Link } from 'src/modules/links/models/link.model';

export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  links?: Link[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  original_link?: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  tags: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(['ONE_ORIGINAL_LINK', 'MULTIPLE_ORIGINAL_LINKS'])
  type: 'ONE_ORIGINAL_LINK' | 'MULTIPLE_ORIGINAL_LINKS';
}
