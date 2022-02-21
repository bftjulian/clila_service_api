import { IsOptional, IsString } from 'class-validator';

export class UpdateLinkDto {
  @IsString()
  @IsOptional()
  surname?: string;

  @IsString()
  @IsOptional()
  name: string;

  short_link: string;

  hash_link: string;
}
