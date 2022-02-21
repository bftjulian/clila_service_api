import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/modules/users/models/users.model';
import { Link } from '../../models/link.model';

@Injectable()
export class LinkRepository {
  constructor(@InjectModel('Link') private readonly linkModel: Model<Link>) {}

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

  public async findAllByUser(
    user: User,
    limit: number,
    page: number,
  ): Promise<any> {
    const count = (await this.linkModel.find({ user })).length;
    const totalPages = Math.round(count / limit);
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
}
