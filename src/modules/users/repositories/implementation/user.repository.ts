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

  public async findById(id: string): Promise<User | undefined> {
    return await this.userModel.findOne({ _id: id });
  }

  public async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  public async setRefreshToken(
    id: string,
    refresh_token: string,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(
      { _id: id },
      { refresh_token: refresh_token },
    );
  }

  public async setApiToken(id: string, api_token: string): Promise<void> {
    await this.userModel.findByIdAndUpdate({ _id: id }, { api_token });
  }

  public async findByRefreshToken(
    refresh_token: string,
  ): Promise<User | undefined> {
    return await this.userModel.findOne({ refresh_token });
  }

  public async findByApiToken(api_token: string): Promise<User | undefined> {
    return await this.userModel.findOne({ api_token });
  }
}
