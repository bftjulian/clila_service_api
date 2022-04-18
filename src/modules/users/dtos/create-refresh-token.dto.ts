import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { User } from '../models/users.model';

export class CreateRefreshTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  refresh_token: string;

  @ApiProperty()
  user: User;

  @ApiProperty()
  created_at: Date;
}
