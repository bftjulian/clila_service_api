import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../models/users.model';
import { UserRepository } from '../../repositories/implementation/user.repository';
import { IUserRepository } from '../../repositories/user-repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  public async create(userData): Promise<User> {
    return this.userRepository.create(userData);
  }
}
