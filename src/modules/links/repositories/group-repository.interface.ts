import { Group } from 'src/modules/links/models/groups.model';
import { User } from 'src/modules/users/models/users.model';
import { QueryDto } from 'src/shared/dtos/query.dto';

export interface IGroupRepository {
  findAll(): Promise<Group[] | undefined>;
  findById(id: string): Promise<Group | undefined>;
  create(data: Partial<Group>): Promise<Group>;
  findAllByUser(user: User, query: QueryDto): Promise<any>;
  incrementClick(id: string): Promise<void>;
}
