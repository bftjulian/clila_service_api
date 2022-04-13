import { User } from 'src/modules/users/models/users.model';
import { LinkInfos } from '../models/link-infos.model';
import { Link } from '../models/link.model';

export interface ILinkRepository {
  create(data: Link): Promise<Link>;
  findByHash(hash_link: string): Promise<Link | undefined>;
  findById(id: string): Promise<Link | undefined>;
  setClickLink(id: string): Promise<void>;
  setNameSurname(id: string, data): Promise<void>;
  findAllByUser(user: User, limit: number, page: number): Promise<any>;
  findAllByUserDownload(user: User): Promise<any>;
  setStatusLink(id: string, status: boolean): Promise<void>;
  removeLinkById(id: string): Promise<void>;
  createLinkInfo(linkInfoData: LinkInfos): Promise<LinkInfos>;
  findAllLinkInfosByLink(link: Link): Promise<any>;
  findAllLinkInfosByDate(date: Date, user: User): Promise<any>;
  findAllLinkInfosByMonth(date: Date, user: User): Promise<any>;
  findAllLinkInfosByWeek(date: Date, user: User): Promise<any>;
}
