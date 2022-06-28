import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group } from '../../../../modules/links/models/groups.model';
import { User } from '../../../../modules/users/models/users.model';
import { QueryDto } from '../../../../shared/dtos/query.dto';
import { queryHelper } from '../../../../utils/queryHelper';
import { CreateGroupDto } from '../../dtos/create-group.dto';
@Injectable()
export class GroupRepository {
  constructor(
    @InjectModel('Group') private readonly groupModel: Model<Group>,
  ) {}

  public async incrementClick(id: string): Promise<void> {
    await this.groupModel.findByIdAndUpdate(
      { _id: id },
      { $inc: { total_clicks: 1 }, update_at: new Date() },
    );
  }

  public async create(groupData: CreateGroupDto): Promise<Group> {
    const group = new this.groupModel(groupData);
    return await group.save();
  }

  public async findById(id: string): Promise<Group | undefined> {
    return await this.groupModel.findById(id);
  }

  public async findAllByUser(user: User, query: QueryDto): Promise<any> {
    const queryParsed = queryHelper(query, {
      allowedSearch: ['name', 'original_link'],
      defaultSearch: { user },
      defaultOrderBy: { createAt: 'desc' },
      allowedFilter: ['name', 'original_link', 'createAt'],
    });
    const count = await this.groupModel.countDocuments(queryParsed.find);
    const totalPages = Math.ceil(count / query.limit);
    const currentPage = (Math.max(1, query.page) - 1) * query.limit;
    const links = await this.groupModel
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
}
