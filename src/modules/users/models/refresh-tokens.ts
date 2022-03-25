import { User } from './users.model';

export class RefreshToken {
  _id?: string;
  refresh_token: string;
  user: User;
  created_at: Date;
  updated_at?: Date;
  __v?: number;
}
