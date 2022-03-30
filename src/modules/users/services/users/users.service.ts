import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Result } from 'src/shared/models/result';
import { CreateUserDto } from '../../dtos/create-users.dto';
import { UserRepository } from '../../repositories/implementation/user.repository';
import { IUserRepository } from '../../repositories/user-repository.interface';
import { verifyPasswordConfirmation } from '../../../../utils/verify-password-confirmation';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../../dtos/login-users.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateRefreshTokenDto } from '../../dtos/create-refresh-token.dto';
import { IUserTokenDto } from 'src/modules/auth/dtos/user-token.dto';
import { Md5 } from 'ts-md5/dist/md5';
import { MailService } from 'src/modules/mail/mail.service';
import { differenceInMonths } from 'date-fns';
import { ResendEmailDto } from '../../dtos/resend-email.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
    private mailService: MailService,
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

    const code = this.generateCodeEmail();

    delete userData.confirmation_password;

    userData.password = await bcrypt.hash(userData.password, 10);
    userData.api_token = Md5.hashStr(userData + Date()).toString();
    userData.code_validation_email = code;
    try {
      const user = await this.userRepository.create(userData);
      await this.mailService.sendValidationEmail(
        userData.email,
        code,
        user._id,
      );

      return new Result(
        await this.i18n.translate('users.INSERT_SUCCESSFULLY', { lang }),
        true,
        {
          api_token: userData.api_token,
          user_id: user._id,
          user_email: user.email,
        },
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
    if (user.code_validation_email != 'A') {
      throw new BadRequestException(
        new Result(
          await this.i18n.translate('users.REQUIRED_VALIDATE_EMAIL', {
            lang,
          }),
          false,
          { user_id: user._id, api_token: user.api_token },
          null,
        ),
      );
    }
    const refTokens = await this.userRepository.findRefreshTokenByUser(user);

    if (refTokens) {
      for (let i = 0; i < refTokens.length; i++) {
        if (refTokens[i].updated_at) {
          const refTokensExpiresUpdated = differenceInMonths(
            refTokens[i].updated_at,
            new Date(Date.now()),
          );
          if (refTokensExpiresUpdated <= -1) {
            await this.userRepository.deleteRefreshTokenById(refTokens[i]._id);
          }
        } else {
          const refTokensExpiresCreated = differenceInMonths(
            refTokens[i].created_at,
            new Date(Date.now()),
          );
          if (refTokensExpiresCreated <= -1) {
            await this.userRepository.deleteRefreshTokenById(refTokens[i]._id);
          }
        }
      }
    }
    const payload = { id: user._id, email: user.email };
    const refreshToken = Md5.hashStr(user.email + Date()).toString();
    try {
      const dataReTokens: CreateRefreshTokenDto = {
        refresh_token: refreshToken,
        user,
        created_at: new Date(Date.now()),
      };
      await this.userRepository.createRefreshTokens(dataReTokens);
      // await this.userRepository.setRefreshToken(user._id, refreshToken);
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
    const refToken = await this.userRepository.findByRefreshToken(
      refresh_token.refresh_token,
    );
    if (!refToken) {
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
    const user = await this.userRepository.findById(refToken.user._id);

    const payload = { id: user._id, email: user.email };
    const refreshToken = Md5.hashStr(user.email + Date()).toString();
    try {
      await this.userRepository.setRefreshToken(
        refToken._id,
        refreshToken,
        new Date(Date.now()),
      );
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

  public async validateToken(api_token) {
    const userValidToken = await this.userRepository.findByApiToken(
      api_token.api_token,
    );
    if (!userValidToken) {
      return false;
    }
    return true;
  }

  public async recoverPassword(email: string, lang: string) {
    const user = await this.userRepository.findByEmail(email);
    const token = Md5.hashStr(Math.random() + Date()).toString();
    if (!user) {
      throw new BadRequestException(
        new Result(
          await this.i18n.translate('users.EMAIL_INVALID', {
            lang,
          }),
          false,
          {},
          null,
        ),
      );
    }
    try {
      await this.userRepository.setRecoverPasswordToken(user._id, {
        recover_password_token: token,
        date_generate_recover_password_token: new Date(),
      });
      const url = `app.cli.la/recoverPassword?email=${email}&token=${token}`;
      await this.mailService.sendRecoverPassword(email, url);
      return new Result(
        await this.i18n.translate('users.RECOVER_PASSWORD', { lang }),
        true,
        { recover_password_token: token, email },
        null,
      );
    } catch (error) {
      throw new BadRequestException(
        new Result('Error in transaction', false, {}, null),
      );
    }
  }

  public async updatePasswordRecover(
    token: string,
    email: string,
    password: string,
    lang: string,
  ) {
    const recoverPasswordToken =
      await this.userRepository.findByRecoverPasswordToken(token);
    const userEmail = await this.userRepository.findByEmail(email);

    if (!recoverPasswordToken) {
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
    if (!userEmail) {
      throw new BadRequestException(
        new Result(
          await this.i18n.translate('users.EMAIL_INVALID', {
            lang,
          }),
          false,
          {},
          null,
        ),
      );
    }

    const dateNow = new Date();
    const timeToken = userEmail.date_generate_recover_password_token;
    const timeExpires =
      dateNow.getTime() > timeToken.getTime() + 24 * 60 * 60 * 1000
        ? true
        : false;

    if (timeExpires) {
      throw new BadRequestException(
        new Result(
          await this.i18n.translate('users.TOKEN_RECOVER_PASS_EXPIRED', {
            lang,
          }),
          false,
          {},
          null,
        ),
      );
    }
    try {
      await this.userRepository.setPassword(
        userEmail._id,
        await bcrypt.hash(password, 10),
      );
      return new Result(
        await this.i18n.translate('users.UPDATE_PASSWORD', { lang }),
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

  public async validateEmail(user_id: string, code: string, lang: string) {
    const user = await this.userRepository.findById(user_id);
    if (!user) {
      throw new BadRequestException(
        new Result(
          await this.i18n.translate('users.NOT_FOUND_USER', {
            lang,
          }),
          false,
          {},
          null,
        ),
      );
    }
    if (user.code_validation_email === 'A') {
      throw new BadRequestException(
        new Result(
          await this.i18n.translate('users.USER_ALREADY_ACTIVE', {
            lang,
          }),
          false,
          {},
          null,
        ),
      );
    }
    if (user.code_validation_email != code) {
      throw new BadRequestException(
        new Result(
          await this.i18n.translate('users.INVALID_CODE', {
            lang,
          }),
          false,
          {},
          null,
        ),
      );
    }
    try {
      await this.userRepository.setCodeActivationEmail(user_id);
      return new Result(
        await this.i18n.translate('users.EMAIL_ACTIVE', { lang }),
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

  private generateCodeEmail() {
    const val1 = Math.floor(Math.random() * (9 - 0 + 1));
    const val2 = Math.floor(Math.random() * (9 - 0 + 1));
    const val3 = Math.floor(Math.random() * (9 - 0 + 1));
    const val4 = Math.floor(Math.random() * (9 - 0 + 1));
    const val5 = Math.floor(Math.random() * (9 - 0 + 1));
    const val6 = Math.floor(Math.random() * (9 - 0 + 1));
    return `${val1}${val2}${val3}${val4}${val5}${val6}`;
  }

  public async resendCodeEmail(email: string, lang: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestException(
        new Result(
          await this.i18n.translate('users.NOT_FOUND_USER', {
            lang,
          }),
          false,
          {},
          null,
        ),
      );
    }
    if (user.code_validation_email === 'A') {
      throw new BadRequestException(
        new Result(
          await this.i18n.translate('users.USER_ALREADY_ACTIVE', {
            lang,
          }),
          false,
          {},
          null,
        ),
      );
    }
    try {
      await this.mailService.sendValidationEmail(
        email,
        user.code_validation_email,
        user._id,
      );
      return new Result(
        await this.i18n.translate('users.EMAIL_CODE_SEND', { lang }),
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

  public async updateEmail(email: string, lang: string, id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new BadRequestException(
        new Result(
          await this.i18n.translate('users.NOT_FOUND_USER', {
            lang,
          }),
          false,
          {},
          null,
        ),
      );
    }

    if (user.code_validation_email === 'A') {
      throw new BadRequestException(
        new Result(
          await this.i18n.translate('users.USER_ALREADY_ACTIVE', {
            lang,
          }),
          false,
          {},
          null,
        ),
      );
    }
    try {
      await this.userRepository.setEmail(id, email);
      await this.mailService.sendValidationEmail(
        email,
        user.code_validation_email,
        user._id,
      );
      return new Result(
        await this.i18n.translate('users.EMAIL_CODE_SEND', { lang }),
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
