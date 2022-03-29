import { IsNotEmpty } from 'class-validator';

export class ResendEmailDto {
  @IsNotEmpty()
  email: string;
}
