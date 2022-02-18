import { User } from 'src/modules/users/models/users.model';
import { Link } from '../models/link.model';

export interface ILinkRepository {
  create(data: Link): Promise<Link>;
  findByHash(hash_link: string): Promise<Link | undefined>;
  setClickLink(id: string): Promise<void>;
  findAllByUser(user: User, limit: number, page: number): Promise<any>;
}
