import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  api_token: string;

  @ApiProperty()
  __v: number;

  @ApiProperty()
  recover_password_token?: string;

  @ApiProperty()
  date_generate_recover_password_token?: Date;

  @ApiProperty()
  code_validation_email?: string;
}
