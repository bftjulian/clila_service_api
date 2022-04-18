import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTokenRecoverPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  recover_password_token: string;

  @ApiProperty()
  @IsNotEmpty()
  date_generate_recover_password_token: Date;
}
