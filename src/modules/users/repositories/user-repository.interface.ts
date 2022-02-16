import { User } from '../models/users.model';

export interface IUserRepository {
  create(data: User): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  findAll(): Promise<User[]>;
}
