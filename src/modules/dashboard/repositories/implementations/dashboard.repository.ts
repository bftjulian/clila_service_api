import { ObjectId } from 'bson';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Link } from '../../../links/models/link.model';
import { Group } from '../../../links/models/groups.model';
import { LinkInfos } from '../../../links/models/link-infos.model';
import { IDashboardRepository } from '../interfaces/dashboard-repository.interface';

@Injectable()
export class DashboardRepository implements IDashboardRepository {
  private readonly clicksPipeline: any[] = [
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
  ];

  constructor(
    @InjectModel('Link')
    private readonly linkModel: Model<Link>,

    @InjectModel('LinkInfos')
    private readonly linkInfosModel: Model<LinkInfos>,

    @InjectModel('Group')
    private readonly groupModel: Model<Group>,
  ) {}

  public async readTotalClicks(id: string) {
    const _id = new ObjectId(id);

    const aggPipeline = [
      { $match: { user: _id } },
      {
        $group: {
          _id: '',
          total_clicks: { $sum: '$numbers_clicks' },
        },
      },
      {
        $project: {
          _id: 0,
          title: 'Total Clicks',
          value: '$total_clicks',
        },
      },
    ];

    const aggregationResult = await this.linkModel.aggregate(aggPipeline);

    return {
      total_clicks: aggregationResult[0] || {
        title: 'Total Clicks',
        value: 0,
      },
    };
  }

  public async readTotalClicksPerPeriod(id: string) {
    const links = await this.linkModel.find({ user: id });

    const orQueries = links.map((link) => {
      return {
        link: {
          $eq: new ObjectId(link.id),
        },
      };
    });

    console.log(orQueries);

    const aggPipeline: any[] = [
      { $match: { $or: orQueries } },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: '%Y-%m-%dT%H:%M',
                date: '$create_at',
              },
            },
          },
          total_clicks: { $count: {} },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id.date',
          total_clicks: 1,
        },
      },
      {
        $sort: { date: -1 },
      },
    ];

    const aggregationResult = await this.linkInfosModel.aggregate(aggPipeline);

    return aggregationResult;
  }

  public async readTotalLinks(id: string) {
    const _id = new ObjectId(id);

    const aggPipeline = [
      { $match: { user: _id } },
      {
        $group: {
          _id: '',
          total_links: { $count: {} },
          // total_clicks: { $sum: '$numbers_clicks' },
        },
      },
      {
        $project: {
          _id: 0,
          title: 'Total Links',
          value: '$total_links',
        },
      },
    ];

    const aggregationResult = await this.linkModel.aggregate(aggPipeline);

    return {
      total_links: aggregationResult[0] || {
        title: 'Total Links',
        value: 0,
      },
    };
  }

  public async readTotalLinksPerPeriod(id: string) {
    const _id = new ObjectId(id);

    const aggPipeline: any[] = [
      { $match: { user: _id } },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: '%Y-%m-%dT%H:%M',
                date: '$create_at',
              },
            },
          },
          total_links: { $count: {} },
          total_clicks: { $sum: '$numbers_clicks' },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id.date',
          total_links: 1,
          total_clicks: 1,
        },
      },
      {
        $sort: { date: -1 },
      },
    ];

    const aggregationResult = await this.linkModel.aggregate(aggPipeline);

    return aggregationResult;
  }

  public async readTotalGroups(id: string) {
    const _id = new ObjectId(id);

    const aggPipeline = [
      { $match: { user: _id } },
      {
        $group: {
          _id: '',
          total_groups: { $count: {} },
        },
      },
      {
        $project: {
          _id: 0,
          title: 'Total Groups',
          value: '$total_groups',
        },
      },
    ];

    const aggregationResult = await this.groupModel.aggregate(aggPipeline);

    return {
      total_groups: aggregationResult[0] || {
        title: 'Total Groups',
        value: 0,
      },
    };
  }

  public async readTotalGroupsPerPeriod(id: string) {
    const _id = new ObjectId(id);

    const aggPipeline: any[] = [
      { $match: { user: _id } },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: '%Y-%m-%dT%H:%M',
                date: '$createAt',
              },
            },
          },
          total_groups: { $count: {} },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id.date',
          total_groups: 1,
        },
      },
      { $sort: { date: -1 } },
    ];

    const aggregationResult = await this.groupModel.aggregate(aggPipeline);

    return aggregationResult;
  }

  public async onEventReadClick(click) {
    const linkId = new ObjectId(click.link);

    const aggPipeline = [];

    aggPipeline.push(
      {
        $match: {
          $and: [{ link: linkId }, { create_at: { $gte: click.date } }],
        },
      },
      ...this.clicksPipeline,
    );

    const aggregationResult = await this.linkInfosModel.aggregate(aggPipeline);

    return aggregationResult;
  }

  public async readDataClicks(id: string) {
    const links = await this.linkModel.find({ user: id });

    const orQueries = links.map((link) => {
      return {
        link: {
          $eq: new ObjectId(link.id),
        },
      };
    });

    const aggPipeline = [];

    aggPipeline.push({ $match: { $or: orQueries } }, ...this.clicksPipeline);

    const aggregationResult = await this.linkInfosModel.aggregate(aggPipeline);

    return aggregationResult;
  }

  public async readDataLinks(id: string) {
    const _id = new ObjectId(id);

    const aggregationResult = await this.linkModel.aggregate([
      { $match: { user: _id } },
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

  public async readDataGroups(id: string) {
    const _id = new ObjectId(id);

    const aggregationResult = await this.groupModel.aggregate([
      { $match: { user: _id } },
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
          _id: 0,
          date: '$_id.date',
          total_groups: 1,
          total_clicks: 1,
        },
      },
    ]);

    return aggregationResult;
  }
}
