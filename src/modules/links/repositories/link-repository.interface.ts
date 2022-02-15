import { Link } from '../models/link.model';

export interface ILinkRepository {
  create(data: Link): Promise<Link>;
}
