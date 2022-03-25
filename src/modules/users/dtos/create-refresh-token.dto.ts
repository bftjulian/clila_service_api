import { IsNotEmpty } from 'class-validator';
import { User } from '../models/users.model';

export class CreateRefreshTokenDto {
  @IsNotEmpty()
  refresh_token: string;

  user: User;

  created_at: Date;
}
