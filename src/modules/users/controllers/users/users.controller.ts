import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { I18nLang } from 'nestjs-i18n';
import { IUserTokenDto } from 'src/modules/auth/dtos/user-token.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { CreateRefreshTokenDto } from '../../dtos/create-refresh-token.dto';
import { CreateUserDto } from '../../dtos/create-users.dto';
import { ValidateApiTokenDto } from '../../dtos/validate-api-token.dto';
import { LoginUserDto } from '../../dtos/login-users.dto';
import { UsersService } from '../../services/users/users.service';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('api/users')
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

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get()
  public async getUsers(@Req() request) {
    const user: IUserTokenDto = request.user;
    return user;
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Patch('refresh-token')
  public async refreshToken(
    @Body() refreshToken: CreateRefreshTokenDto,
    @I18nLang() lang: string,
  ) {
    return await this.usersService.refreshToken(refreshToken, lang);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Patch('invalidate-token')
  public async invalidateToken(@I18nLang() lang: string, @Req() request) {
    const user: IUserTokenDto = request.user;
    return await this.usersService.invalidateToken(user, lang);
  }

  @Get('validate-token')
  public async validateToken(@Query() api_token: ValidateApiTokenDto) {
    return await this.usersService.validateToken(api_token);
  }
}
