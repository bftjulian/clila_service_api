import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ValidateEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  code: string;
}
