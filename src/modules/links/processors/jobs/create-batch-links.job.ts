import { Link } from '../../models/link.model';

export interface ICreateBatchLinksJob {
  links: Partial<Link>[];
}
