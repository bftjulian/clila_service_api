import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { User } from 'src/modules/users/models/users.model';
import { Link } from '../../models/link.model';
import { LinkInfos } from '../../models/link-infos.model';
import {
  addDays,
  endOfDay,
  endOfMonth,
  isSameDay,
  getDaysInMonth,
  startOfDay,
  startOfMonth,
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

  public async findById(id: string): Promise<Link | undefined> {
    return await this.linkModel.findOne({ _id: id });
  }

  public async setClickLink(id: string): Promise<void> {
    await this.linkModel.findByIdAndUpdate(
      { _id: id },
      { $inc: { numbers_clicks: 1 } },
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
      },
    );
  }

  public async removeLinkById(id: string): Promise<void> {
    await this.linkModel.findByIdAndDelete({ _id: id });
  }

  public async findAllByUser(
    user: User,
    limit: number,
    page: number,
  ): Promise<any> {
    const count = (await this.linkModel.find({ user })).length;
    // const div = count / limit;
    const totalPages = Math.ceil(count / limit);
    const currentPage = (Math.max(1, page) - 1) * limit;
    const links = await this.linkModel
      .find({ user })
      .limit(limit)
      .skip(currentPage)
      .sort({ _id: 'asc' });
    const data = {
      data: links,
      total_pages: totalPages,
      count,
    };
    return data;
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
        }
        linksInfo.push(infoLinks);
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
}
