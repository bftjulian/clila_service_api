import { ApiProperty } from '@nestjs/swagger';
import { User } from './users.model';

export class RefreshToken {
  @ApiProperty()
  _id?: string;

  @ApiProperty()
  refresh_token: string;

  @ApiProperty()
  user: User;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at?: Date;

  @ApiProperty()
  __v?: number;
}
