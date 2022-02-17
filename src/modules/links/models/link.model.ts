import { User } from 'src/modules/users/models/users.model';

export class Link {
  _id: string;

  name: string;

  surname?: string;

  original_link: string;

  short_link: string;

  hash_link: string;

  numbers_clicks: number;

  user: User;

  create_at: Date;
}
