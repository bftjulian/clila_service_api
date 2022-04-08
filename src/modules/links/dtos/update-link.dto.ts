import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateLinkDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  surname?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  short_link: string;

  @ApiProperty()
  hash_link: string;
}
