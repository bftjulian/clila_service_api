import { User } from 'src/modules/users/models/users.model';
import { UpdateLinkDto } from '../dtos/update-link.dto';
import { Link } from '../models/link.model';

export interface ILinkRepository {
  create(data: Link): Promise<Link>;
  findByHash(hash_link: string): Promise<Link | undefined>;
  findById(id: string): Promise<Link | undefined>;
  setClickLink(id: string): Promise<void>;
  setNameSurname(id: string, data): Promise<void>;
  findAllByUser(user: User, limit: number, page: number): Promise<any>;
}
