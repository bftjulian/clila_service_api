import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Group } from 'src/modules/links/models/groups.model';
import { CreateGroupDto } from '../../dtos/create-group.dto';
import { IGroupRepository } from '../group-repository.interface';
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
}
