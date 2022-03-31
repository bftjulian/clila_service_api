import {
  Body,
  Controller,
  Get,
  Param,
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
import { RecoverPasswordDto } from '../../dtos/recover-password.dto';
import { QueryUpdateRecoverPasswordDto } from '../../dtos/query-update-recover-password.dto';
import { UpdatePasswordDto } from '../../dtos/update-password.dto';
import { ValidateEmailDto } from '../../dtos/validate-email.dto';
import { ResendEmailDto } from '../../dtos/resend-email.dto';

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

  @SkipThrottle()
  @Get('validate-token')
  public async validateToken(@Query() api_token: ValidateApiTokenDto) {
    return await this.usersService.validateToken(api_token);
  }

  @Post('recover-password')
  public async recoverPassword(
    @I18nLang() lang: string,
    @Body() data: RecoverPasswordDto,
  ) {
    return await this.usersService.recoverPassword(data.email, lang);
  }

  @Post('update-password-recover')
  public async updatePasswordRecover(
    @I18nLang() lang: string,
    @Query() query: QueryUpdateRecoverPasswordDto,
    @Body() data: UpdatePasswordDto,
  ) {
    return this.usersService.updatePasswordRecover(
      query.token,
      query.email,
      data.password,
      lang,
    );
  }

  @Patch(':id/validate-email')
  public async validateEmail(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() data: ValidateEmailDto,
  ) {
    return this.usersService.validateEmail(id, data.code, lang);
  }

  @Post('resend-code-email')
  public async resendCodeEmail(
    @I18nLang() lang: string,
    @Body() data: ResendEmailDto,
  ) {
    return this.usersService.resendCodeEmail(data.email, lang);
  }

  @Patch(':id/email-activate')
  public async updateEmail(
    @I18nLang() lang: string,
    @Body() data: ResendEmailDto,
    @Param('id') id: string,
  ) {
    return this.usersService.updateEmail(data.email, lang, id);
  }
}
