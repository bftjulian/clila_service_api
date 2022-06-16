import { Injectable } from '@nestjs/common';
import { User } from '../../../../modules/users/models/users.model';
import { QueryDto } from 'src/shared/dtos/query.dto';
import { Group } from '../../models/groups.model';
import { Link } from '../../models/link.model';
import { LinkInfos } from '../../models/link-infos.model';
import { ILinkRepository } from '../link-repository.interface';
import { ObjectId } from 'mongodb';

interface ILinkInfos {
  _id: string;
  ip: string;
  create_at: Date;
  link: Link;
}
@Injectable()
export class FakeLinkRepository implements ILinkRepository {
  private links: Link[] = [];
  private linksInfo: ILinkInfos[] = [];

  public async create(
    linkData: Omit<Link, '_id' | 'status' | 'isMalicious'>,
  ): Promise<Link> {
    const link = {
      _id: 'id_link_fake',
      ...linkData,
      status: 'ACTIVE',
      create_at: new Date('2022-06-14T17:57:19.534Z'),
      update_at: new Date('2022-06-14T17:57:19.534Z'),
    } as Link;
    this.links.push(link);
    return link;
  }

  public async setManyMaliciousByOriginalLink(links: string[]): Promise<void> {
    const linksMalicius = this.links.map((link) => {
      links.map((l) => {
        if (link.original_link === l) {
          link.isMalicious = true;
        }
        return l;
      });
      return link;
    }) as Link[];
    this.links.push(...linksMalicius);
    return;
  }

  public async unsetManyMaliciousByOriginalLink(
    links: string[],
  ): Promise<void> {
    links.forEach((l) => {
      this.links.forEach((link) => {
        if (link.original_link === l) {
          link.isMalicious = false;
        }
      });
      return l;
    });
    return;
  }

  public async findByHash(hash_link: string): Promise<Link | undefined> {
    return this.links.find((link) => link.hash_link === hash_link);
  }

  public async createMany(links: Partial<Link>[]): Promise<Link[]> {
    const insertLinks = links.map((link) => {
      const linkCreated = new Link();
      Object.assign(linkCreated, {
        ...link,
        _id: new ObjectId().toHexString(),
      });
      return linkCreated;
    });

    this.links.push(...insertLinks);
    return insertLinks;
  }

  public async findManyByOriginalLink(links: string[]): Promise<Link[]> {
    const linksAll = this.links.map((link) => {
      links.map((l) => {
        if (link.original_link === l) {
          link.isMalicious = true;
        }
        return l;
      });
      return link;
    }) as Link[];
    return linksAll;
  }

  public async findAllByGroup(group: Group, query: QueryDto): Promise<any> {
    const links = this.links.filter((link) => link.group === group);
    const data = {
      data: links,
      total_pages: 1,
      count: 1,
    };
    return data;
  }

  public async findActiveByHash(hash_link: string): Promise<Link | undefined> {
    return this.links.find((link) => link.hash_link === hash_link);
  }

  public async findById(id: string): Promise<Link | undefined> {
    return this.links.find((link) => link._id === id);
  }

  public async setClickLink(id: string): Promise<Link> {
    let data: Link;
    this.links.forEach((link) => {
      if (link._id === id) {
        link.numbers_clicks += 1;
        data = link;
      }
    });
    return data;
  }

  public async findGroupRefByGroup(group: Group): Promise<Link | undefined> {
    return this.links.find(
      (link) => link.group_ref === true && link.group === group,
    );
  }

  public async setNameSurname(id: string, data): Promise<void> {
    this.links.forEach((link) => {
      if (link._id === id) {
        link = data;
      }
    });
    return;
  }

  public async setStatusLink(id: string, status: boolean): Promise<void> {
    this.links.forEach((link) => {
      if (link._id === id) {
        link.active = status;
      }
    });
    return;
  }

  public async findAllNotExpired(page: number, limit: number): Promise<Link[]> {
    return this.links.filter(
      (link) => link.expired_at === null && link.group_ref === false,
    );
  }

  public async findAllMaliciousAndNotExpired(): Promise<Link[]> {
    return this.links.filter(
      (link) =>
        (link.expired_at === null &&
          link.group_ref === false &&
          link.isMalicious === true &&
          link.group === null) ||
        (link.expired_at === null &&
          link.group_ref === true &&
          link.isMalicious === true),
    );
  }

  public async findAllNotMaliciousAndNotExpiredWithoutGroupLinks(): Promise<
    Link[]
  > {
    return this.links.filter(
      (link) =>
        (link.expired_at === null &&
          link.group_ref === false &&
          (link.isMalicious === false || link.isMalicious === null) &&
          link.group === null) ||
        (link.expired_at === null &&
          link.group_ref === true &&
          (link.isMalicious === false || link.isMalicious === null)),
    );
  }

  public async countAllNotExpired(): Promise<number> {
    return 1;
  }

  public async removeLinkById(id: string): Promise<void> {
    const findIndex = this.links.findIndex((link) => link._id === id);
    if (findIndex >= 0) {
      this.links.splice(findIndex, 1);
    }
    return;
  }

  public async findAllByUserWithQuery(
    user: User,
    query: QueryDto,
  ): Promise<any> {
    const links = this.links.filter((link) => link.user === user);
    const data = {
      data: links,
      total_pages: 1,
      count: 1,
    };
    return data;
  }

  public async findAllByUser(user: User): Promise<any> {
    return this.links.filter((link) => link.user === user);
  }

  public async findAllByUserDownload(user: User): Promise<any> {
    return this.links.filter((link) => link.user === user);
  }

  public async createLinkInfo(linkInfoData: LinkInfos): Promise<LinkInfos> {
    const linkInfos = {
      _id: 'infos_fake',
      ...linkInfoData,
    };
    this.linksInfo.push(linkInfos);
    const data = { ...linkInfos };
    return data;
  }

  public async findAllLinkInfosByLink(link: Link): Promise<any> {
    return this.linksInfo.filter((linkInfo) => linkInfo.link === link);
  }

  public async findAllLinkInfosByDate(date: Date, user: User): Promise<any> {
    return this.linksInfo.filter((link) => link.create_at === date);
  }
  public async findAllLinkInfosByMonth(date: Date, user: User): Promise<any> {
    return this.linksInfo.filter((link) => link.create_at === date);
  }

  public async findAllLinkInfosByWeek(date: Date, user: User): Promise<any> {
    return this.linksInfo.filter((link) => link.create_at === date);
  }

  public async findAllByAfterMonth(
    date: Date,
    status: boolean,
  ): Promise<Link[] | undefined> {
    return this.links.filter((link) => link.create_at === date);
  }

  public async inactiveAllBeforeDate(date: Date): Promise<string[]> {
    return ['kk'];
  }

  public async findAllGroupRefByUser(
    user: User,
    query?: QueryDto,
  ): Promise<any> {
    return this.links.filter(
      (link) => link.group_ref === true && link.user === user,
    );
  }

  public async createGroupRef(group: Group): Promise<Link> {
    const data = {
      name: group.name,
      user: group.user,
      active: true,
      status: 'ACTIVE',
      original_link: group.original_link,
      group_ref: true,
      group,
    } as Link;
    return data;
  }
}
