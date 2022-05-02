import { Link } from 'src/modules/links/models/link.model';

export default interface IInfoClicksWebhookProvider {
  create(link: Link): Promise<boolean>;
}
