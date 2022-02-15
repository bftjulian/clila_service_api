import { User } from '../models/users.model';

export interface IUserRepository {
  create(data: User): Promise<User>;
}
