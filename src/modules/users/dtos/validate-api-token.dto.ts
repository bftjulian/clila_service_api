import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ValidateApiTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  api_token: string;
}
