import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../../services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  public async create(@Body() data) {
    await this.usersService.create(data);
    return {};
  }
}
