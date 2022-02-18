import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { exec } from 'child_process';
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

  public async setClickLink(id: string): Promise<void> {
    await this.linkModel.findByIdAndUpdate(
      { _id: id },
      { $inc: { numbers_clicks: 1 } },
    );
  }

  public async findAllByUser(
    user: User,
    limit: number,
    page: number,
  ): Promise<any> {
    const count = (await this.linkModel.find({ user })).length;
    const totalPages = Math.round(count / limit);
    const links = await this.linkModel.find({ user }).limit(limit).skip(page);
    const data = {
      data: links,
      total_pages: totalPages,
      count,
      current_page: page,
    };
    return data;
  }
}
