import { ObjectId } from 'bson';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Link } from '../../../links/models/link.model';
import { Group } from 'src/modules/links/models/groups.model';
import { IUserTokenDto } from '../../../auth/dtos/user-token.dto';
import { LinkInfos } from '../../../links/models/link-infos.model';
import { IDashboardRepository } from '../interfaces/dashboard-repository.interface';

@Injectable()
export class DashboardRepository implements IDashboardRepository {
  constructor(
    @InjectModel('Link')
    private readonly linkModel: Model<Link>,

    @InjectModel('LinkInfos')
    private readonly linkInfosModel: Model<LinkInfos>,

    @InjectModel('Group')
    private readonly groupModel: Model<Group>,
  ) {}

  public async readDataLinks(user: IUserTokenDto) {
    const userId = new ObjectId(user.id);

    const aggregationResult = await this.linkModel.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: '%Y-%m-%dT%H:%M', date: '$create_at' },
            },
            group: '$group',
          },
          count_links: { $count: {} },
          total_clicks: { $sum: '$numbers_clicks' },
        },
      },
      {
        $lookup: {
          from: 'groups',
          localField: '_id.group',
          foreignField: '_id',
          as: 'group',
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id.date',
          group: { $first: '$group' },
          count_links: 1,
          total_clicks: 1,
        },
      },
      {
        $project: {
          date: 1,
          group_id: '$group._id',
          group_name: '$group.name',
          group_tags: '$group.tags',
          count_links: 1,
          total_clicks: 1,
        },
      },
      {
        $sort: {
          date: -1,
        },
      },
    ]);

    return aggregationResult;
  }

  public async readDataClicks(user: IUserTokenDto) {
    const userId = new ObjectId(user.id);

    const links = await this.linkModel.find({ user: userId });

    const orQueries = links.map((link) => {
      return {
        link: {
          $eq: new ObjectId(link.id),
        },
      };
    });

    const aggregationResult = await this.linkInfosModel.aggregate([
      { $match: { $or: orQueries } },
      {
        $group: {
          _id: {
            link: '$link',
            date: {
              $dateToString: { format: '%Y-%m-%dT%H:%M', date: '$create_at' },
            },
          },
          clicks: { $count: {} },
        },
      },
      {
        $lookup: {
          from: 'links',
          localField: '_id.link',
          foreignField: '_id',
          as: 'link',
        },
      },
      {
        $project: {
          _id: 0,
          clicks: 1,
          date: '$_id.date',
          link: { $first: '$link' },
        },
      },
      {
        $lookup: {
          from: 'groups',
          localField: 'link.group',
          foreignField: '_id',
          as: 'group',
        },
      },
      {
        $project: {
          clicks: 1,
          date: 1,
          link: 1,
          group: { $first: '$group' },
        },
      },
      {
        $project: {
          date: 1,
          clicks: 1,
          name: '$link.name',
          link_id: '$link._id',
          group_id: '$group._id',
          group_name: '$group.name',
          group_tags: '$group.tag',
          short_link: '$link.short_link',
          original_link: '$link.original_link',
          total_clicks: '$link.numbers_clicks',
        },
      },
      {
        $sort: {
          date: -1,
        },
      },
    ]);

    return aggregationResult;
  }
  public async readDataGroups(user: IUserTokenDto) {
    const userId = new ObjectId(user.id);

    const aggregationResult = await this.groupModel.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: '%Y-%m-%dT%H:%M', date: '$createdAt' },
            },
          },
          total_groups: { $count: {} },
          total_clicks: { $sum: '$total_clicks' },
        },
      },
      {
        $project: {
          date: '$_id.date',
          total_groups: 1,
          total_clicks: 1,
        },
      },
    ]);

    return aggregationResult;
  }
}
