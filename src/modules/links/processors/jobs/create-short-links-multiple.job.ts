import { User } from '../../../../modules/users/models/users.model';

export interface ICreateShortLinksMultipleJob {
  original_link: string;
  short_link: string;
  hash_link: string;
  user: User;
}
