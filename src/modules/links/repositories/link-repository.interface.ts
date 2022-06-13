import { User } from 'src/modules/users/models/users.model';
import { LinkInfos } from '../models/link-infos.model';
import { Link } from '../models/link.model';
import { QueryDto } from '../../../shared/dtos/query.dto';
import { Group } from '../models/groups.model';

export interface ILinkRepository {
  findAllNotMaliciousAndNotExpiredWithoutGroupLinks(): Promise<Link[]>;
  findAllMaliciousAndNotExpired(): Promise<Link[]>;
  setManyMaliciousByOriginalLink(links: string[]): Promise<void>;
  unsetManyMaliciousByOriginalLink(links: string[]): Promise<void>;
  findManyByOriginalLink(links: string[]): Promise<Link[]>;
  findAllByAfterMonth(date: Date, status: boolean): Promise<Link[] | undefined>;
  findByHash(hash_link: string): Promise<Link | undefined>;
  findActiveByHash(hash_link: string): Promise<Link | undefined>;
  findById(id: string): Promise<Link | undefined>;
  findAllByUser(user: User): Promise<any>;
  findAllByUserDownload(user: User): Promise<any>;
  findAllByGroup(group: Group, query: QueryDto): Promise<any>;
  findAllGroupRefByUser(user: User, query?: QueryDto): Promise<any>;
  findGroupRefByGroup(group: Group): Promise<Link | undefined>;
  setClickLink(id: string): Promise<Link>;
  createMany(links: Partial<Link>[]): Promise<Link[]>;
  findAllByUserWithQuery(user: User, query: QueryDto): Promise<any>;
  findAllNotExpired(page: number, limit: number): Promise<Link[]>;
  countAllNotExpired(): Promise<number>;
  findAllLinkInfosByLink(link: Link): Promise<any>;
  findAllLinkInfosByDate(date: Date, user: User): Promise<any>;
  findAllLinkInfosByMonth(date: Date, user: User): Promise<any>;
  findAllLinkInfosByWeek(date: Date, user: User): Promise<any>;
  create(data: Omit<Link, 'status' | 'isMalicious'>): Promise<Link>;
  createGroupRef(group: Group): Promise<Link>;
  setNameSurname(id: string, data): Promise<void>;
  setStatusLink(id: string, status: boolean): Promise<void>;
  removeLinkById(id: string): Promise<void>;
  createLinkInfo(linkInfoData: LinkInfos): Promise<LinkInfos>;
  inactiveAllBeforeDate(date: Date): Promise<string[]>;
}
