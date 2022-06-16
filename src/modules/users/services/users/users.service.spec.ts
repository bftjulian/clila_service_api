import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';
import { Result } from '../../../../shared/models/result';
import { MailService } from '../../../../modules/mail/mail.service';
import { CreateUserDto } from '../../dtos/create-users.dto';
import { User } from '../../models/users.model';
import { FakeUserRepository } from '../../repositories/fakes/user.fake.repository';
import { UserRepository } from '../../repositories/implementation/user.repository';
import { IUserRepository } from '../../repositories/user-repository.interface';
import { UsersService } from './users.service';
import { Md5 } from 'ts-md5';
import * as bcrypt from 'bcrypt';
import { IUserTokenDto } from '../../../../modules/auth/dtos/user-token.dto';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: IUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockImplementation((text) => text),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendValidationEmail: jest.fn(),
            sendRecoverPassword: jest.fn(),
          },
        },
        {
          provide: I18nService,
          useValue: {
            translate: jest.fn().mockImplementation((text) => text),
          },
        },
        {
          provide: UserRepository,
          useClass: FakeUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<IUserRepository>(UserRepository);
  });
  const dataUser = {
    email: 'fake@example.com',
    password: '123123Nn',
    confirmation_password: '123123Nn',
  } as CreateUserDto;

  const user = {
    email: 'teste@teste',
    id: 'id_fake',
  } as IUserTokenDto;
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('TEST METHOD: create', () => {
    it('should return exception if user has not confirmed his password', async () => {
      const data = {
        email: 'teste@teste.com',
        password: '123123Nn',
        confirmation_password: '123123Nnn',
      } as CreateUserDto;
      const result = service.create(data, 'en');
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      await expect(result).rejects.toThrow('users.PASSWORD_CONFIRMATION');
    });

    it('should return exception if the registered email already exists', async () => {
      await usersRepository.create(dataUser);
      const result = service.create(dataUser, 'en');
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      await expect(result).rejects.toThrow('users.EMAIL_EXISTS');
    });

    it('should return success if you enter a user', async () => {
      // await usersRepository.create(dataUser);
      jest
        .spyOn(Md5, 'hashStr')
        .mockImplementationOnce(
          jest.fn().mockReturnValue('69f378c3522cfcc4feb9c4c83dc2cb34'),
        );
      const result = await service.create(
        { _id: 'fake_user', ...dataUser },
        'en',
      );
      expect(result).toBeInstanceOf(Result);
      expect(result).toEqual(
        expect.objectContaining({
          data: {
            api_token: '69f378c3522cfcc4feb9c4c83dc2cb34',
            user_id: 'fake_user',
            user_email: 'fake@example.com',
          },
        }),
      );
    });
  });

  describe('TEST METHOD: login', () => {
    it('should return execution if no user exists', async () => {
      const result = service.login(
        { email: 'fake@example.com', password: 'passwordFake' },
        'en',
      );
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      await expect(result).rejects.toThrow('users.USER_NOT_FOUND');
    });

    it('should return exception if password is incorrect', async () => {
      await usersRepository.create(dataUser);
      const result = service.login(
        { email: 'fake@example.com', password: 'passwordFake' },
        'en',
      );
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      await expect(result).rejects.toThrow('users.USER_NOT_FOUND');
    });

    it('should return exception if the email is not confirmed', async () => {
      await usersRepository.create(dataUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce(jest.fn().mockReturnValue(true));
      const result = service.login(
        { email: 'fake@example.com', password: '123123Nn' },
        'en',
      );
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      await expect(result).rejects.toThrow('users.REQUIRED_VALIDATE_EMAIL');
    });

    it('should return success if user completes login', async () => {
      await usersRepository.create({
        _id: 'user_fake',
        ...dataUser,
        code_validation_email: 'A',
        api_token: '69f378c3522cfcc4feb9c4c83dc2cb34',
      });
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce(jest.fn().mockReturnValue(true));
      jest
        .spyOn(Md5, 'hashStr')
        .mockImplementationOnce(
          jest.fn().mockReturnValue('1e30c59a3708b10686df4313e4b59c58'),
        );

      const result = await service.login(
        { email: 'fake@example.com', password: '123123Nn' },
        'en',
      );

      expect(result).toBeInstanceOf(Result);
      expect(result).toEqual(
        expect.objectContaining({
          data: {
            access_token: { id: 'user_fake', email: 'fake@example.com' },
            api_token: '69f378c3522cfcc4feb9c4c83dc2cb34',
            refresh_token: '1e30c59a3708b10686df4313e4b59c58',
          },
        }),
      );
    });
  });

  describe('TEST METHOD: refreshToken', () => {
    it('should return exception if token is invalid', async () => {
      const userModel = await usersRepository.create(dataUser);

      const result = service.refreshToken(
        {
          refresh_token: 'fake@example.com',
          user: userModel,
          created_at: new Date(),
        },
        'en',
      );
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      await expect(result).rejects.toThrow('users.TOKEN_INVALID');
    });

    it('should return success if refresh token is valid', async () => {
      const userModel = await usersRepository.create({
        _id: 'user_fake',
        ...dataUser,
        api_token: '69f378c3522cfcc4feb9c4c83dc2cb34',
      });
      await usersRepository.createRefreshTokens({
        _id: 'fake_refresh_token',
        refresh_token: 'asdas',
        user: userModel,
        created_at: new Date('2022-06-14T17:57:19.534Z'),
      });
      jest
        .spyOn(Md5, 'hashStr')
        .mockImplementationOnce(
          jest.fn().mockReturnValue('1e30c59a3708b10686df4313e4b59c58'),
        );
      const result = await service.refreshToken(
        {
          refresh_token: 'asdas',
          user: userModel,
          created_at: new Date(),
        },
        'en',
      );
      expect(result).toBeInstanceOf(Result);
      expect(result).toEqual(
        expect.objectContaining({
          data: {
            access_token: { id: 'user_fake', email: 'fake@example.com' },
            api_token: '69f378c3522cfcc4feb9c4c83dc2cb34',
            refresh_token: '1e30c59a3708b10686df4313e4b59c58',
          },
        }),
      );
    });
  });

  describe('TEST METHOD: invalidateToken', () => {
    it('should return success if revoking a token', async () => {
      await usersRepository.create({
        _id: 'id_fake',
        ...dataUser,
        api_token: '69f378c3522cfcc4feb9c4c83dc2cb34',
      });
      const result = await service.invalidateToken(user, 'en');
      expect(result).toBeInstanceOf(Result);
      expect(result).toEqual(
        expect.objectContaining({
          message: 'users.TOKEN_REVOGED',
        }),
      );
    });
  });

  describe('TEST METHOD: validateToken', () => {
    it('should return false if there is no api token', async () => {
      const result = await service.validateToken({
        api_token: '69f378c3522cfcc4feb9c4c83dc2cb34',
      });
      expect(result).toEqual(false);
    });

    it('should return true if there is no api token', async () => {
      await usersRepository.create({
        _id: 'id_fake',
        ...dataUser,
        api_token: '69f378c3522cfcc4feb9c4c83dc2cb34',
      });
      const result = await service.validateToken({
        api_token: '69f378c3522cfcc4feb9c4c83dc2cb34',
      });
      expect(result).toEqual(true);
    });
  });

  describe('TEST METHOD: recoverPassword', () => {
    it('should return exception if the email is invalid', async () => {
      const result = service.recoverPassword('fake@example.com', 'en');
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      await expect(result).rejects.toThrow('users.EMAIL_INVALID');
    });

    it('should return success', async () => {
      await usersRepository.create({
        _id: 'id_fake',
        ...dataUser,
        api_token: '69f378c3522cfcc4feb9c4c83dc2cb34',
      });
      jest
        .spyOn(Md5, 'hashStr')
        .mockImplementationOnce(
          jest.fn().mockReturnValue('90732cbd9d90feba668a336e944273cf'),
        );
      const result = await service.recoverPassword('fake@example.com', 'en');
      expect(result).toBeInstanceOf(Result);
      expect(result).toEqual(
        expect.objectContaining({
          data: {
            recover_password_token: '90732cbd9d90feba668a336e944273cf',
            email: 'fake@example.com',
          },
          message: 'users.RECOVER_PASSWORD',
        }),
      );
    });
  });

  describe('TEST METHOD: updatePasswordRecover', () => {
    it('should return execution if the token is invalid', async () => {
      const result = service.updatePasswordRecover(
        '90732cbd9d90feba668a336e944273cf',
        '123123Nn',
        'fake@example.com',
        'en',
      );
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      await expect(result).rejects.toThrow('users.TOKEN_INVALID');
    });

    it('should return exception if the email is invalid', async () => {
      await usersRepository.create({
        _id: 'id_fake',
        ...dataUser,
        api_token: '69f378c3522cfcc4feb9c4c83dc2cb34',
        recover_password_token: 'token_recover_password',
      });
      const result = service.updatePasswordRecover(
        'token_recover_password',
        'fake1@example.com',
        '123123Nn',
        'en',
      );
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      await expect(result).rejects.toThrow('users.EMAIL_INVALID');
    });

    it('should return execution if token is expired', async () => {
      await usersRepository.create({
        _id: 'id_fake',
        ...dataUser,
        api_token: '69f378c3522cfcc4feb9c4c83dc2cb34',
        recover_password_token: 'token_recover_password',
        date_generate_recover_password_token: new Date(
          '2022-06-14T17:57:19.534Z',
        ),
      });
      const result = service.updatePasswordRecover(
        'token_recover_password',
        'fake@example.com',
        '123123Nn',
        'en',
      );
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      await expect(result).rejects.toThrow('users.TOKEN_RECOVER_PASS_EXPIRED');
    });

    it('should return success if you change the password', async () => {
      await usersRepository.create({
        _id: 'id_fake',
        ...dataUser,
        api_token: '69f378c3522cfcc4feb9c4c83dc2cb34',
        recover_password_token: 'token_recover_password',
        date_generate_recover_password_token: new Date(
          '2040-06-14T17:57:19.534Z',
        ),
      });
      const result = await service.updatePasswordRecover(
        'token_recover_password',
        'fake@example.com',
        '123123Nn',
        'en',
      );
      expect(result).toBeInstanceOf(Result);
      expect(result).toEqual(
        expect.objectContaining({
          message: 'users.UPDATE_PASSWORD',
        }),
      );
    });
  });

  describe('TEST METHOD: validateEmail', () => {
    it('should return exception if there is no user', async () => {
      const result = service.validateEmail('fake', '123123', 'en');
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      await expect(result).rejects.toThrow('users.NOT_FOUND_USER');
    });

    it('should return exception if the email is already active', async () => {
      await usersRepository.create({
        _id: 'id_fake',
        ...dataUser,
        api_token: '69f378c3522cfcc4feb9c4c83dc2cb34',
        recover_password_token: 'token_recover_password',
        date_generate_recover_password_token: new Date(
          '2040-06-14T17:57:19.534Z',
        ),
        code_validation_email: 'A',
      });

      const result = service.validateEmail('id_fake', '123123', 'en');
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      await expect(result).rejects.toThrow('users.USER_ALREADY_ACTIVE');
    });

    it('should return an exception if the code is invalid', async () => {
      await usersRepository.create({
        _id: 'id_fake',
        ...dataUser,
        api_token: '69f378c3522cfcc4feb9c4c83dc2cb34',
        recover_password_token: 'token_recover_password',
        date_generate_recover_password_token: new Date(
          '2040-06-14T17:57:19.534Z',
        ),
        code_validation_email: '111111',
      });

      const result = service.validateEmail('id_fake', '123123', 'en');
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      await expect(result).rejects.toThrow('users.INVALID_CODE');
    });

    it('should return success if you activate the email', async () => {
      await usersRepository.create({
        _id: 'id_fake',
        ...dataUser,
        api_token: '69f378c3522cfcc4feb9c4c83dc2cb34',
        recover_password_token: 'token_recover_password',
        date_generate_recover_password_token: new Date(
          '2040-06-14T17:57:19.534Z',
        ),
        code_validation_email: '123123',
      });

      const result = await service.validateEmail('id_fake', '123123', 'en');
      expect(result).toBeInstanceOf(Result);
      expect(result).toEqual(
        expect.objectContaining({
          message: 'users.EMAIL_ACTIVE',
        }),
      );
    });
  });

  describe('TEST METHOD: resendCodeEmail', () => {
    it('should return exception if there is no user', async () => {
      const result = service.resendCodeEmail('fake@example.com', 'en');
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      await expect(result).rejects.toThrow('users.NOT_FOUND_USER');
    });

    it('should return exception if the email is already active', async () => {
      await usersRepository.create({
        _id: 'id_fake',
        ...dataUser,
        api_token: '69f378c3522cfcc4feb9c4c83dc2cb34',
        recover_password_token: 'token_recover_password',
        date_generate_recover_password_token: new Date(
          '2040-06-14T17:57:19.534Z',
        ),
        code_validation_email: 'A',
      });

      const result = service.resendCodeEmail('fake@example.com', 'en');
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      await expect(result).rejects.toThrow('users.USER_ALREADY_ACTIVE');
    });

    it('should return success if you resubmit the code', async () => {
      await usersRepository.create({
        _id: 'id_fake',
        ...dataUser,
        api_token: '69f378c3522cfcc4feb9c4c83dc2cb34',
        recover_password_token: 'token_recover_password',
        date_generate_recover_password_token: new Date(
          '2040-06-14T17:57:19.534Z',
        ),
        code_validation_email: '123123',
      });

      const result = await service.resendCodeEmail('fake@example.com', 'en');
      expect(result).toBeInstanceOf(Result);
      expect(result).toEqual(
        expect.objectContaining({
          message: 'users.EMAIL_CODE_SEND',
        }),
      );
    });
  });

  describe('TEST METHOD: updateEmail', () => {
    it('should return exception if there is no user', async () => {
      const result = service.updateEmail('fake@example.com', 'en', 'id_fake');
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      await expect(result).rejects.toThrow('users.NOT_FOUND_USER');
    });

    it('should return exception if the email is already active', async () => {
      await usersRepository.create({
        _id: 'id_fake',
        ...dataUser,
        api_token: '69f378c3522cfcc4feb9c4c83dc2cb34',
        recover_password_token: 'token_recover_password',
        date_generate_recover_password_token: new Date(
          '2040-06-14T17:57:19.534Z',
        ),
        code_validation_email: 'A',
      });

      const result = service.updateEmail('fake@example.com', 'en', 'id_fake');
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      await expect(result).rejects.toThrow('users.USER_ALREADY_ACTIVE');
    });

    it('should return success if you do the email update', async () => {
      await usersRepository.create({
        _id: 'id_fake',
        ...dataUser,
        api_token: '69f378c3522cfcc4feb9c4c83dc2cb34',
        recover_password_token: 'token_recover_password',
        date_generate_recover_password_token: new Date(
          '2040-06-14T17:57:19.534Z',
        ),
        code_validation_email: '123123',
      });

      const result = await service.updateEmail(
        'fake@example.com',
        'en',
        'id_fake',
      );
      expect(result).toBeInstanceOf(Result);
      expect(result).toEqual(
        expect.objectContaining({
          message: 'users.EMAIL_CODE_SEND',
        }),
      );
    });
  });
});
