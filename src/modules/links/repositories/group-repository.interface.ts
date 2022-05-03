import { Group } from 'src/modules/links/models/groups.model';
import { CreateGroupDto } from '../dtos/create-group.dto';

export interface IGroupRepository {
  findAll(): Promise<Group[] | undefined>;
  findById(id: string): Promise<Group | undefined>;
  create(data: Partial<Group>): Promise<Group>;
}
