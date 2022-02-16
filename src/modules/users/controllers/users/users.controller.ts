import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { I18nLang } from 'nestjs-i18n';
import { IUserTokenDto } from 'src/modules/auth/dtos/user-token.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { CreateRefreshTokenDto } from '../../dtos/create-refresh-token.dto';
import { CreateUserDto } from '../../dtos/create-users.dto';
import { LoginUserDto } from '../../dtos/login-users.dto';
import { UsersService } from '../../services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  public async create(@Body() data: CreateUserDto, @I18nLang() lang: string) {
    const user = await this.usersService.create(data, lang);
    return user;
  }

  @Post('login')
  public async login(@Body() data: LoginUserDto, @I18nLang() lang: string) {
    return await this.usersService.login(data, lang);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  public async getUsers(@Req() request) {
    const user: IUserTokenDto = request.user;
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('refresh-token')
  public async refreshToken(
    @Body() refreshToken: CreateRefreshTokenDto,
    @I18nLang() lang: string,
  ) {
    return await this.usersService.refreshToken(refreshToken, lang);
  }
}
