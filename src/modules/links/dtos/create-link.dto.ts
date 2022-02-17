import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from 'src/modules/users/models/users.model';

export class CreateLinkDto {
  _id: string;

  name: string;

  short_link: string;

  hash_link: string;

  numbers_clicks: number;

  // @IsString()
  @IsOptional()
  surname?: string;

  user: User;

  @IsNotEmpty()
  @IsString()
  original_link: string;

  create_at: Date;
}
