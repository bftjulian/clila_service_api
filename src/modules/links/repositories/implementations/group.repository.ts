import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Group } from 'src/modules/links/models/groups.model';
import { CreateGroupDto } from '../../dtos/create-group.dto';
@Injectable()
export class GroupRepository {
  constructor(
    @InjectModel('Group') private readonly groupModel: Model<Group>,
  ) {}

  public async create(groupData: CreateGroupDto): Promise<Group> {
    const group = new this.groupModel(groupData);
    return await group.save();
  }
}
