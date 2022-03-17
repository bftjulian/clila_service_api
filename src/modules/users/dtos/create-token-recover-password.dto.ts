import { IsNotEmpty } from 'class-validator';

export class CreateTokenRecoverPasswordDto {
  @IsNotEmpty()
  recover_password_token: string;

  @IsNotEmpty()
  date_generate_recover_password_token: Date;
}
