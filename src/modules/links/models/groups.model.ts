import { ApiProperty } from '@nestjs/swagger';
import { Link } from './link.model';

export class Group {
  @ApiProperty()
  name: string;

  @ApiProperty()
  links: Link[];

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
