import { User } from 'src/modules/users/models/users.model';
import { LinkInfos } from '../models/link-infos.model';
import { Link } from '../models/link.model';
import { QueryDto } from '../../../shared/dtos/query.dto';

export interface ILinkRepository {
  findAll(): Promise<Link[] | undefined>;
  findAllByAfterMonth(date: Date, status: boolean): Promise<Link[] | undefined>;
  findByHash(hash_link: string): Promise<Link | undefined>;
  findActiveByHash(hash_link: string): Promise<Link | undefined>;
  findById(id: string): Promise<Link | undefined>;
  findAllByUser(user: User): Promise<any>;
  findAllByUserDownload(user: User): Promise<any>;
  findAllByUserWithQuery(user: User, query: QueryDto): Promise<any>;
  createBatchLinks(
    linkData: Omit<Link, 'hash_link' | 'short_link'>,
    count: number,
  ): Promise<Pick<Link, '_id' | 'short_link'>[]>;
  findAllLinkInfosByLink(link: Link): Promise<any>;
  findAllLinkInfosByDate(date: Date, user: User): Promise<any>;
  findAllLinkInfosByMonth(date: Date, user: User): Promise<any>;
  findAllLinkInfosByWeek(date: Date, user: User): Promise<any>;
  findAllNotExpired(): Promise<Link[]>;
  create(data: Omit<Link, 'status'>): Promise<Link>;
  setClickLink(id: string): Promise<void>;
  setNameSurname(id: string, data): Promise<void>;
  setStatusLink(id: string, status: boolean): Promise<void>;
  removeLinkById(id: string): Promise<void>;
  createLinkInfo(linkInfoData: LinkInfos): Promise<LinkInfos>;
  inactiveAllBeforeDate(date: Date): Promise<void>;
}
