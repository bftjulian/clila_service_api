import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ResendEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  email: string;
}
