import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { User } from 'src/modules/users/models/users.model';
import { Link } from '../../models/link.model';
import { LinkInfos } from '../../models/link-infos.model';
import { QueryDto } from '../../../../shared/dtos/query.dto';
import { queryHelper } from 'src/utils/queryHelper';
import {
  addDays,
  endOfDay,
  endOfMonth,
  isSameDay,
  getDaysInMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  endOfWeek,
} from 'date-fns';

@Injectable()
export class LinkRepository {
  constructor(
    @InjectModel('Link') private readonly linkModel: Model<Link>,
    @InjectModel('LinkInfos') private readonly linkInfosModel: Model<LinkInfos>,
  ) {}

  public async create(linkData: Link): Promise<Link> {
    const link = new this.linkModel(linkData);
    return await link.save();
  }

  public async findByHash(hash_link: string): Promise<Link | undefined> {
    return await this.linkModel.findOne({ hash_link });
  }

  public async createMany(
    links: Partial<Link>[],
  ): Promise<Pick<Link, '_id' | 'short_link'>[]> {
    const data = await this.linkModel.insertMany(links, {
      ordered: false,
    });

    // return data;
    return data.map((item) => ({ _id: item._id, short_link: item.short_link }));
  }

  public async findAllByGroup(
    groupId: string,
  ): Promise<Pick<Link, '_id' | 'short_link'>[]> {
    return this.linkModel.find({ group: groupId }).select('_id short_link');
  }

  public async findActiveByHash(hash_link: string): Promise<Link | undefined> {
    return await this.linkModel.findOne({
      hash_link,
      active: true,
      expired_at: null,
    });
  }

  public async findById(id: string): Promise<Link | undefined> {
    return await this.linkModel.findOne({ _id: id });
  }

  public async setClickLink(id: string): Promise<void> {
    await this.linkModel.findByIdAndUpdate(
      { _id: id },
      { $inc: { numbers_clicks: 1 }, update_at: new Date() },
    );
  }

  public async setNameSurname(id: string, data): Promise<void> {
    await this.linkModel.findByIdAndUpdate(
      { _id: id },
      {
        name: data.name,
        surname: data.surname,
        short_link: data.short_link,
        hash_link: data.hash_link,
      },
    );
  }

  public async setStatusLink(id: string, status: boolean): Promise<void> {
    await this.linkModel.findByIdAndUpdate(
      { _id: id },
      {
        active: status,
        status: status ? 'ACTIVE' : 'INACTIVE',
      },
    );
  }

  public async findAllNotExpired(page: number, limit: number): Promise<Link[]> {
    return this.linkModel
      .find({ expired_at: null })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  public async countAllNotExpired(): Promise<number> {
    return await this.linkModel.countDocuments({ expired_at: null });
  }

  public async removeLinkById(id: string): Promise<void> {
    await this.linkModel.findByIdAndDelete({ _id: id });
  }

  public async findAllByUserWithQuery(
    user: User,
    query: QueryDto,
  ): Promise<any> {
    const queryParsed = queryHelper(query, {
      allowedSearch: ['name', 'surname'],
      defaultSearch: { user },
      defaultOrderBy: { create_at: 'desc' },
      defaultSearchOrExpressions: [
        { group: { $eq: null } },
        { group_ref: true },
      ],
      allowedFilter: ['name', 'surname', 'create_at'],
    });

    const count = (await this.linkModel.find(queryParsed.find)).length;
    // const div = count / limit;
    const totalPages = Math.ceil(count / query.limit);
    const currentPage = (Math.max(1, query.page) - 1) * query.limit;
    const links = await this.linkModel
      .find(queryParsed.find)
      .sort(queryParsed.sort)
      .limit(query.limit)
      .skip(currentPage)
      .sort({ _id: 'asc' });
    const data = {
      data: links,
      total_pages: totalPages,
      count,
    };
    return data;
  }

  public async findAllByUser(user: User): Promise<any> {
    const links = await this.linkModel.find({ user }).sort({ _id: 'asc' });

    return links;
  }

  public async findAllByUserDownload(user: User): Promise<any> {
    return await this.linkModel.find({ user });
  }

  public async createLinkInfo(linkInfoData: LinkInfos): Promise<LinkInfos> {
    const linkInfos = new this.linkInfosModel(linkInfoData);
    return await linkInfos.save();
  }

  public async findAllLinkInfosByLink(link: Link): Promise<any> {
    return await this.linkInfosModel.find({ link });
  }

  public async findAllLinkInfosByDate(date: Date, user: User): Promise<any> {
    const links = await this.linkModel.find({ user });
    const linksInfo = [];
    for (const link of links) {
      let infoLinks: any;
      const info = await this.linkInfosModel.find({
        create_at: { $gte: startOfDay(date), $lte: endOfDay(date) },
        link: { $eq: link },
      });
      if (info.length > 0) {
        for (let x = 0; x < info.length; x++) {
          infoLinks = info[x];
          linksInfo.push(infoLinks);
        }
      }
    }
    return linksInfo;
  }
  public async findAllLinkInfosByMonth(date: Date, user: User): Promise<any> {
    const links = await this.linkModel.find({ user });
    const start = startOfMonth(date);

    const data = await Promise.all(
      links.map((link) =>
        Promise.resolve(
          this.linkInfosModel.find({
            create_at: { $gte: startOfMonth(date), $lte: endOfMonth(date) },
            link: { $eq: link },
          }),
        ),
      ),
    );
    const linksInfo = [].concat(...data);
    const days = Array.from({ length: getDaysInMonth(date) }, (_, i) =>
      addDays(start, i),
    ).map((day) => ({
      day,
      clicks: linksInfo.filter((info) => isSameDay(day, info.create_at)).length,
    }));

    return days;
  }

  public async findAllLinkInfosByWeek(date: Date, user: User): Promise<any> {
    const links = await this.linkModel.find({ user });
    const linksInfo = [];
    for (const link of links) {
      const infoLinks: any = {};
      const info = await this.linkInfosModel
        .find({
          create_at: { $gte: startOfWeek(date), $lte: endOfWeek(date) },
          link: { $eq: link },
        })
        .populate({ path: 'link', match: '_id' });

      if (info.length > 0) {
        for (let x = 0; x < info.length; x++) {
          infoLinks.link = info[x].link;
          infoLinks.count = x + 1;
        }
        linksInfo.push(infoLinks);
      }
    }
    return linksInfo;
  }

  public async findAllByAfterMonth(
    date: Date,
    status: boolean,
  ): Promise<Link[] | undefined> {
    return await this.linkModel.find({
      update_at: { $lte: date },
      active: status,
    });
  }

  public async inactiveAllBeforeDate(date: Date): Promise<string[]> {
    const links = await this.linkModel
      .find({
        update_at: { $lte: date },
      })
      .select('hash_link');
    await this.linkModel.updateMany(
      {
        update_at: { $lte: date },
      },
      { active: false, expired_at: new Date(), status: 'INACTIVE' },
    );

    return links.map((link) => link.hash_link);
  }
}
