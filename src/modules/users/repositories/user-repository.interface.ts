import { User } from '../models/users.model';

export interface IUserRepository {
  create(data: User): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
  findByApiToken(api_token: string): Promise<User | undefined>;
  findAll(): Promise<User[]>;
  setRefreshToken(id: string, refresh_token: string): Promise<void>;
  setApiToken(id: string, api_token: string): Promise<void>;
  findByRefreshToken(refresh_token: string): Promise<User | undefined>;
  findByApiTokenPanel(api_token: string);
}
