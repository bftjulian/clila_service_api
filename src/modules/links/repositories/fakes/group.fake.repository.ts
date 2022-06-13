import { User } from '../../../../modules/users/models/users.model';
import { QueryDto } from '../../../../shared/dtos/query.dto';
import { CreateGroupDto } from '../../dtos/create-group.dto';
import { Group } from '../../models/groups.model';
import { IGroupRepository } from '../group-repository.interface';

export class FakeGroup implements IGroupRepository {
  private groups: Group[] = [];

  public async incrementClick(id: string): Promise<void> {
    const incClick = this.groups.find((g) => g._id === id);
    incClick.total_clicks += 1;
    incClick.updated_at = new Date();
  }

  public async create(groupData: CreateGroupDto): Promise<Group> {
    const dataGroup = {
      _id: 'group_fake',
      ...groupData,
      user: {},
      total_clicks: 1,
      created_at: new Date(),
      updated_at: new Date(),
    } as Group;
    this.groups.push(dataGroup);
    return dataGroup;
  }

  public async findById(id: string): Promise<Group | undefined> {
    return this.groups.find((group) => group._id === id);
  }

  public async findAllByUser(user: User, query: QueryDto): Promise<any> {
    const links = this.groups.filter((group) => group.user === user);
    const data = {
      data: links,
      total_pages: 1,
      count: 1,
    };
    return data;
  }
}
