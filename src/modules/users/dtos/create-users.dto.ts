import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  confirmation_password: string;

  @ApiProperty()
  api_token: string;

  @ApiProperty()
  refresh_token: string;

  @ApiProperty()
  code_validation_email: string;

  @ApiProperty()
  _id: string;

  @ApiProperty()
  __v: number;
}
