import {
  Body,
  Controller,
  Get,
  HttpStatus,
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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../../models/users.model';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiResponse({
    description: 'Create a new user',
    type: User,
    status: HttpStatus.OK,
  })
  public async create(@Body() data: CreateUserDto, @I18nLang() lang: string) {
    const user = await this.usersService.create(data, lang);
    return user;
  }

  @Post('login')
  @ApiResponse({
    description: 'Login a user',
    type: User,
    status: HttpStatus.OK,
  })
  public async login(@Body() data: LoginUserDto, @I18nLang() lang: string) {
    return await this.usersService.login(data, lang);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({
    description: 'Brings information from an authenticated user',
    type: User,
    status: HttpStatus.OK,
  })
  public async getUsers(@Req() request) {
    const user: IUserTokenDto = request.user;
    return user;
  }

  @SkipThrottle()
  @Patch('refresh-token')
  @ApiResponse({
    description: 'Generate a refresh token',
    type: User,
    status: HttpStatus.OK,
  })
  public async refreshToken(
    @Body() refreshToken: CreateRefreshTokenDto,
    @I18nLang() lang: string,
  ) {
    return await this.usersService.refreshToken(refreshToken, lang);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Patch('invalidate-token')
  @ApiResponse({
    description: 'Invalidates a token',
    type: User,
    status: HttpStatus.OK,
  })
  public async invalidateToken(@I18nLang() lang: string, @Req() request) {
    const user: IUserTokenDto = request.user;
    return await this.usersService.invalidateToken(user, lang);
  }

  @SkipThrottle()
  @Get('validate-token')
  @ApiResponse({
    description: 'Validates a token',
    type: User,
    status: HttpStatus.OK,
  })
  public async validateToken(@Query() api_token: ValidateApiTokenDto) {
    return await this.usersService.validateToken(api_token);
  }

  @Post('recover-password')
  @ApiResponse({
    description: 'Recover password',
    type: User,
    status: HttpStatus.OK,
  })
  public async recoverPassword(
    @I18nLang() lang: string,
    @Body() data: RecoverPasswordDto,
  ) {
    return await this.usersService.recoverPassword(data.email, lang);
  }

  @Post('update-password-recover')
  @ApiResponse({
    description: 'Make password change',
    type: User,
    status: HttpStatus.OK,
  })
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
  @ApiResponse({
    description: 'Do email validation',
    type: User,
    status: HttpStatus.OK,
  })
  public async validateEmail(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() data: ValidateEmailDto,
  ) {
    return this.usersService.validateEmail(id, data.code, lang);
  }

  @Post('resend-code-email')
  @ApiResponse({
    description: 'Resend the email code',
    type: User,
    status: HttpStatus.OK,
  })
  public async resendCodeEmail(
    @I18nLang() lang: string,
    @Body() data: ResendEmailDto,
  ) {
    return this.usersService.resendCodeEmail(data.email, lang);
  }

  @Patch(':id/email-activate')
  @ApiResponse({
    description: 'Make changes to an email',
    type: User,
    status: HttpStatus.OK,
  })
  public async updateEmail(
    @I18nLang() lang: string,
    @Body() data: ResendEmailDto,
    @Param('id') id: string,
  ) {
    return this.usersService.updateEmail(data.email, lang, id);
  }
}
