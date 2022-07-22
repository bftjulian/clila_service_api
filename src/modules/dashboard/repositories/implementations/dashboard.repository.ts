import { ObjectId } from 'bson';
import { Model } from 'mongoose';
import { ClicksPipeline, GroupsPipeline, LinksPipeline } from './queries';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Link } from '../../../links/models/link.model';
import { Group } from '../../../links/models/groups.model';
import { LinkInfos } from '../../../links/models/link-infos.model';
import { IDashboardRepository } from '../interfaces/dashboard-repository.interface';
@Injectable()
export class DashboardRepository implements IDashboardRepository {
  private readonly linksPipeline: any[] = LinksPipeline;
  private readonly clicksPipeline: any[] = ClicksPipeline;
  private readonly groupsPipeline: any[] = GroupsPipeline;

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
          value: '$total_clicks',
        },
      },
    ];

    const aggregationResult = await this.linkModel.aggregate(aggPipeline);

    const resultValue = aggregationResult[0].value || 0;

    return resultValue;
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

  public async readTotalClicksPerPeriod(id: string) {
    const links = await this.linkModel.find({ user: id });

    const orQueries = links.map((link) => {
      return {
        link: {
          $eq: new ObjectId(link.id),
        },
      };
    });

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
        },
      },
      {
        $project: {
          _id: 0,
          value: '$total_links',
        },
      },
    ];

    const aggregationResult = await this.linkModel.aggregate(aggPipeline);

    return aggregationResult[0].value || 0;
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
          value: '$total_groups',
        },
      },
    ];

    const aggregationResult = await this.groupModel.aggregate(aggPipeline);

    return aggregationResult[0].value || 0;
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

  public async readClickEvent(click) {
    const linkId = new ObjectId(click.link);

    const aggPipeline = [];

    aggPipeline.push(
      {
        $match: {
          $and: [{ link: linkId }, { create_at: { $gte: click.create_at } }],
        },
      },
      ...this.clicksPipeline,
    );

    const aggregationResult = await this.linkInfosModel.aggregate(aggPipeline);

    return aggregationResult;
  }

  public async readManyLinksCreatedEvent(linkInformation) {
    const userId = new ObjectId(linkInformation.user);

    const aggregationPipeline = [
      // {
      //   $match: {
      //     $and: [{ link: linkId }, { create_at: { $gte: link.create_at } }],
      //   },
      // },
      {
        $match: {
          $and: [
            { user: userId },
            { create_at: { $gte: linkInformation.date } },
          ],
        },
      },
      ...this.linksPipeline,
    ];

    const aggregationResult = await this.linkModel.aggregate(
      aggregationPipeline,
    );

    return aggregationResult;
  }

  public async readGroupCreatedEvent(group: Group) {
    const userId = new ObjectId(group.user);

    const aggregationPipeline = [
      {
        $match: {
          $and: [
            { user: userId },
            {
              created_at: { $gte: group.created_at },
            },
          ],
        },
      },
    ];

    const aggregationResult = await this.groupModel.aggregate(
      aggregationPipeline,
    );

    return aggregationResult;
  }

  public async readDataLinks(id: string) {
    const _id = new ObjectId(id);

    const aggregationPipeline = [
      { $match: { user: _id } },
      ...this.linksPipeline,
    ];

    const aggregationResult = await this.linkModel.aggregate(
      aggregationPipeline,
    );

    return aggregationResult;
  }

  public async readDataGroups(id: string) {
    const _id = new ObjectId(id);

    const aggregationPipeline = [
      { $match: { user: _id } },
      ...this.groupsPipeline,
    ];

    const aggregationResult = await this.groupModel.aggregate(
      aggregationPipeline,
    );

    return aggregationResult;
  }
}
