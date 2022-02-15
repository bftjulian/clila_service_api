import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Link } from '../../models/link.model';

@Injectable()
export class LinksService {
  constructor(@InjectModel('Link') private readonly linkModel: Model<Link>) {}

  public async create(linkData) {
    const link = new this.linkModel(linkData);
    return await link.save();
  }
}
