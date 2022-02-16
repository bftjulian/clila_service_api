import { Body, Controller, Post } from '@nestjs/common';
import { I18nLang } from 'nestjs-i18n';
import { CreateUserDto } from '../../dtos/create-users.dto';
import { UsersService } from '../../services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  public async create(@Body() data: CreateUserDto, @I18nLang() lang: string) {
    const user = await this.usersService.create(data, lang);
    return user;
  }
}
