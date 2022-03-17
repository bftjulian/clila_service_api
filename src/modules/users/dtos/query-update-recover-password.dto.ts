import { IsNotEmpty } from 'class-validator';

export class QueryUpdateRecoverPasswordDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  token: string;
}
