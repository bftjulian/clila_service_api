import { Link } from '../models/link.model';

export interface ILinkRepository {
  create(data: Link): Promise<Link>;
  findByHash(hash_link: string): Promise<Link | undefined>;
  setClickLink(id: string): Promise<void>;
}
