import { IsNotEmpty } from 'class-validator';

export class ValidateApiTokenDto {
  @IsNotEmpty()
  api_token: string;
}
