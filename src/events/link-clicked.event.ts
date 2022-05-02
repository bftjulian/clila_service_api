import { Link } from 'src/modules/links/models/link.model';

export class LinkClickedEvent {
  link: Link;
  ip: string;
}
