import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmation_password: string;

  api_token: string;

  refresh_token: string;

  _id: string;

  __v: number;
}
