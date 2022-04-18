import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RecoverPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  email: string;
}
