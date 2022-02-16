import { IsNotEmpty } from 'class-validator';

export class CreateRefreshTokenDto {
  @IsNotEmpty()
  refresh_token: string;
}
