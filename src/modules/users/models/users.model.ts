import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class User {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  @Exclude()
  password: string;

  @ApiProperty()
  @Exclude()
  api_token: string;

  @ApiProperty()
  __v: number;

  @ApiProperty()
  @Exclude()
  recover_password_token?: string;

  @ApiProperty()
  @Exclude()
  date_generate_recover_password_token?: Date;

  @ApiProperty()
  @Exclude()
  code_validation_email?: string;

  @ApiProperty()
  @Exclude()
  created_at?: Date;

  @ApiProperty()
  @Exclude()
  updated_at?: Date;

  @ApiProperty()
  @Exclude()
  date_validation_code_email?: Date;
}
