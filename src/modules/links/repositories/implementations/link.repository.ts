import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/modules/users/models/users.model';
import { Link } from '../../models/link.model';
import { LinkInfos } from '../../models/link-infos.model';
import { QueryDto } from '../../shared/dtos/query.dto';
import { queryHelper } from 'src/utils/queryHelper';

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

  public async findAllByUser(user: User, query: QueryDto): Promise<any> {
    const queryParsed = queryHelper(query, {
      allowedSearch: ['name', 'surname'],
      defaultSearch: { user },
      defaultOrderBy: { create_at: 'desc' },
    });
    console.log(queryParsed);
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
}
