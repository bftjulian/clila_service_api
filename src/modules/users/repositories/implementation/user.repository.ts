import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../models/users.model';
import { IUserRepository } from '../user-repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@InjectModel('User') private readonly linkModel: Model<User>) {}

  public async create(userData: User): Promise<User> {
    const link = new this.linkModel(userData);
    return await link.save();
  }
}
