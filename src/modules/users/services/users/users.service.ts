import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Result } from 'src/shared/models/result';
import { CreateUserDto } from '../../dtos/create-users.dto';
import { User } from '../../models/users.model';
import { UserRepository } from '../../repositories/implementation/user.repository';
import { IUserRepository } from '../../repositories/user-repository.interface';
import { verifyPasswordConfirmation } from '../../../../utils/verify-password-confirmation';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
    private readonly i18n: I18nService,
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
    try {
      await this.userRepository.create(userData);
      return new Result(
        await this.i18n.translate('users.INSERT_SUCCESSFULLY', { lang }),
        true,
        {},
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
}
