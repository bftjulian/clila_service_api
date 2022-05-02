import { ApiProperty } from '@nestjs/swagger';
import { Link } from 'src/modules/links/models/link.model';

export class CreateGroupDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  links?: Link[];

  @ApiProperty()
  original_link: string;

  @ApiProperty()
  tags: string[];
}
