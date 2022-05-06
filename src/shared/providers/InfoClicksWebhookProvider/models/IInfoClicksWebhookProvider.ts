import { Link } from 'src/modules/links/models/link.model';

export default interface IInfoClicksWebhookProvider {
  sendClickInfo(link: Link): Promise<boolean>;
}
