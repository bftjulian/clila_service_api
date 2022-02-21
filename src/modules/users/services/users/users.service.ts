import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Result } from 'src/shared/models/result';
import { CreateUserDto } from '../../dtos/create-users.dto';
import { UserRepository } from '../../repositories/implementation/user.repository';
import { IUserRepository } from '../../repositories/user-repository.interface';
import { verifyPasswordConfirmation } from '../../../../utils/verify-password-confirmation';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../../dtos/login-users.dto';
import { JwtService } from '@nestjs/jwt';
import { Md5 } from 'ts-md5/dist/md5';
import { CreateRefreshTokenDto } from '../../dtos/create-refresh-token.dto';
import { IUserTokenDto } from 'src/modules/auth/dtos/user-token.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
    private readonly i18n: I18nService,
    private readonly jwtService: JwtService,
  ) {}

  public async create(userData: CreateUserDto, lang: string) {
    const emailExists = await this.userRepository.findByEmail(userData.email);
    const verifyPassConfirmation = verifyPasswordConfirmation(
      userData.password,
      userData.confirmation_password,
    );
    if (!verifyPassConfirmation) {
      throw new BadRequestException(
        new Result(
          await this.i18n.translate('users.PASSWORD_CONFIRMATION', {
            lang,
          }),
          false,
          {},
          null,
        ),
      );
    }
    if (emailExists) {
      throw new BadRequestException(
        new Result(
          await this.i18n.translate('users.EMAIL_EXISTS', {
            lang,
          }),
          false,
          {},
          null,
        ),
      );
    }
    delete userData.confirmation_password;
    userData.password = await bcrypt.hash(userData.password, 10);
    userData.api_token = Md5.hashStr(userData + Date()).toString();

    try {
      await this.userRepository.create(userData);
      return new Result(
        await this.i18n.translate('users.INSERT_SUCCESSFULLY', { lang }),
        true,
        { api_token: userData.api_token },
        null,
      );
    } catch (err) {
      throw new BadRequestException(
        new Result(
          await this.i18n.translate('users.ERROR_INSERT_USER', { lang }),
          false,
          {},
          err.message,
        ),
      );
    }
  }

  public async login(data: LoginUserDto, lang: string) {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new BadRequestException(
        new Result(
          await this.i18n.translate('users.USER_NOT_FOUND', {
            lang,
          }),
          false,
          {},
          null,
        ),
      );
    }
    const isMatchPassword = await bcrypt.compare(data.password, user.password);
    if (!isMatchPassword) {
      throw new BadRequestException(
        new Result(
          await this.i18n.translate('users.USER_NOT_FOUND', {
            lang,
          }),
          false,
          {},
          null,
        ),
      );
    }
    const payload = { id: user._id, email: user.email };
    const refreshToken = Md5.hashStr(user.email + Date()).toString();
    try {
      await this.userRepository.setRefreshToken(user._id, refreshToken);
      return new Result(
        '',
        true,
        {
          access_token: this.jwtService.sign(payload),
          api_token: user.api_token,
          refresh_token: refreshToken,
        },
        null,
      );
    } catch (error) {
      throw new BadRequestException(
        new Result('Error in transaction', false, {}, null),
      );
    }
  }

  public async refreshToken(
    refresh_token: CreateRefreshTokenDto,
    lang: string,
  ) {
    const user = await this.userRepository.findByRefreshToken(
      refresh_token.refresh_token,
    );
    if (!user) {
      throw new BadRequestException(
        new Result(
          await this.i18n.translate('users.TOKEN_INVALID', {
            lang,
          }),
          false,
          {},
          null,
        ),
      );
    }
    const payload = { id: user._id, email: user.email };
    const refreshToken = Md5.hashStr(user.email + Date()).toString();
    try {
      await this.userRepository.setRefreshToken(user._id, refreshToken);
      return new Result(
        '',
        true,
        {
          access_token: this.jwtService.sign(payload),
          api_token: user.api_token,
          refresh_token: refreshToken,
        },
        null,
      );
    } catch (error) {
      throw new BadRequestException(
        new Result('Error in transaction', false, {}, null),
      );
    }
  }

  public async invalidateToken(user: IUserTokenDto, lang: string) {
    const userExists = await this.userRepository.findById(user.id);
    if (userExists) {
      try {
        const api_token = Md5.hashStr(userExists + Date()).toString();
        await this.userRepository.setApiToken(user.id, api_token);
        return new Result(
          await this.i18n.translate('users.TOKEN_REVOGED', { lang }),
          true,
          {},
          null,
        );
      } catch (error) {
        throw new BadRequestException(
          new Result('Error in transaction', false, {}, null),
        );
      }
    }
  }

  public async validateToken(user: IUserTokenDto, api_token) {
    const userValidToken = await this.userRepository.findByIdApiToken(
      user.id,
      api_token.api_token,
    );
    if (!userValidToken) {
      throw new UnauthorizedException('');
    }
    return true;
  }
}
