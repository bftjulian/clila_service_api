import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/users/models/users.model';
import { Group } from './groups.model';

export class Link {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  group?: Group;

  @ApiProperty()
  group_ref?: boolean;

  @ApiProperty()
  surname?: string;

  @ApiProperty()
  original_link: string;

  @ApiProperty()
  short_link: string;

  @ApiProperty()
  hash_link: string;

  @ApiProperty()
  numbers_clicks: number;

  @ApiProperty()
  user: User;

  @ApiProperty()
  expired_at?: Date | null;

  @ApiProperty()
  create_at?: Date;

  @ApiProperty()
  update_at?: Date;

  @ApiProperty()
  active?: boolean;
}
