import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/users/models/users.model';
import { Link } from './link.model';

export class Group {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  links: Link[];

  @ApiProperty()
  user?: User;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  original_link: string;

  @ApiProperty()
  total_clicks: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
