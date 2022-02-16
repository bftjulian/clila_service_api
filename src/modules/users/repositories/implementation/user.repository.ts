import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../models/users.model';
import { IUserRepository } from '../user-repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  public async create(userData: User): Promise<User> {
    const user = new this.userModel(userData);
    return await user.save();
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return await this.userModel.findOne({ email });
  }

  public async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }
}
