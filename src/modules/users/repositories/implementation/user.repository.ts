import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTokenRecoverPasswordDto } from '../../dtos/create-token-recover-password.dto';
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

  public async setRecoverPasswordToken(
    id: string,
    data: CreateTokenRecoverPasswordDto,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(
      { _id: id },
      {
        recover_password_token: data.recover_password_token,
        date_generate_recover_password_token:
          data.date_generate_recover_password_token,
      },
    );
  }

  public async setPassword(id: string, password: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(
      { _id: id },
      {
        password,
        recover_password_token: null,
        date_generate_recover_password_token: null,
      },
    );
  }

  public async setCodeActivationEmail(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(
      { _id: id },
      {
        code_validation_email: 'A',
      },
    );
  }

  public async findByRefreshToken(
    refresh_token: string,
  ): Promise<User | undefined> {
    return await this.userModel.findOne({ refresh_token });
  }

  public async findByApiToken(api_token: string): Promise<User | undefined> {
    return await this.userModel.findOne({ api_token });
  }

  public async findByApiTokenPanel(api_token: string) {
    return await this.userModel.findOne({ api_token });
  }

  public async findByRecoverPasswordToken(recover_password_token: string) {
    return await this.userModel.findOne({ recover_password_token });
  }
}
