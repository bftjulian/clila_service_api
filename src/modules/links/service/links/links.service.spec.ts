import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';
import FakeRedisProvider from '../../../../shared/providers/RedisProvider/fakes/FakeRedisProvider';
import RedisProvider from '../../../../shared/providers/RedisProvider/implementations/RedisProvider';
import { FakeUserRepository } from '../../../../modules/users/repositories/fakes/user.fake.repository';
import { UserRepository } from '../../../../modules/users/repositories/implementation/user.repository';
import { FakeHashRepository } from '../../repositories/fakes/hash.fake.repository';
import { FakeLinkRepository } from '../../repositories/fakes/link.fake.repository';
import { HashRepository } from '../../repositories/implementations/hash.repository';
import { LinkRepository } from '../../repositories/implementations/link.repository';
import { LinksService } from './links.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ILinkRepository } from '../../repositories/link-repository.interface';
import { IUserRepository } from '../../../../modules/users/repositories/user-repository.interface';
import { IHashRepository } from '../../repositories/hash-repository.interface';
import { CreateLinkDto } from '../../dtos/create-link.dto';
import { IUserTokenDto } from '../../../../modules/auth/dtos/user-token.dto';
import { User } from '../../../../modules/users/models/users.model';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Result } from '../../../../shared/models/result';
import { QueryDto } from '../../../../shared/dtos/query.dto';

describe('LinksService', () => {
  let service: LinksService;
  let linksRepository: ILinkRepository;
  let usersRepository: IUserRepository;
  let hashesRepository: IHashRepository;

  const user = {
    email: 'teste@teste',
    id: 'id_fake',
  } as IUserTokenDto;

  const data = {
    original_link: 'http://example.com',
    surname: 'JohnDoe',
  } as CreateLinkDto;

  const query = {} as QueryDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinksService,
        {
          provide: LinkRepository,
          useClass: FakeLinkRepository,
        },
        {
          provide: UserRepository,
          useClass: FakeUserRepository,
        },
        {
          provide: HashRepository,
          useClass: FakeHashRepository,
        },
        {
          provide: RedisProvider,
          useClass: FakeRedisProvider,
        },
        {
          provide: I18nService,
          useValue: {
            translate: jest.fn().mockImplementation((text) => text),
          },
        },
        {
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<LinksService>(LinksService);
    linksRepository = module.get<ILinkRepository>(LinkRepository);
    usersRepository = module.get<IUserRepository>(UserRepository);
    hashesRepository = module.get<IHashRepository>(HashRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('TEST METHOD: create', () => {
    it('should return exception if the nickname is already in use', async () => {
      const dataUser = {
        _id: 'user_fake',
        email: 'fake@example',
        password: 'passwordFake',
        api_token: 'fake',
        __v: 1,
      } as User;
      const userModel = await usersRepository.create(dataUser);
      await linksRepository.create({
        name: 'Link Test',
        original_link: 'http://example.com',
        surname: 'JohnDoe',
        short_link: 'cli.la/JohnDoe',
        hash_link: 'JohnDoe',
        numbers_clicks: 1,
        user: userModel,
      });
      const result = service.create(data, user, 'en');

      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      await expect(result).rejects.toThrow('links.ERROR_SURNAME');
    });

    it('should return not found if there is no user', async () => {
      const result = service.create(data, user, 'en');

      await expect(result).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should return success if you shorten a link', async () => {
      const dataUser = {
        _id: 'id_fake',
        email: 'fake@example',
        password: 'passwordFake',
        api_token: 'fake',
        __v: 1,
      } as User;
      await usersRepository.create(dataUser);

      const result = await service.create(data, user, 'en');
      expect(result).toBeInstanceOf(Result);
      expect(result).toEqual(
        expect.objectContaining({
          data: {
            short_link: 'https://cli.la/JohnDoe',
            id: 'id_link_fake',
            original_link: 'https://example.com',
          },
        }),
      );
    });
  });

  describe('TEST METHOD: listLinksUser', () => {
    it('should return not found if there is no user', async () => {
      const result = service.listLinksUser(user, query);

      await expect(result).rejects.toBeInstanceOf(ForbiddenException);
    });
    it('should return success', async () => {
      const dataUser = {
        _id: 'id_fake',
        email: 'fake@example',
        password: 'passwordFake',
        api_token: 'fake',
        __v: 1,
      } as User;
      const userModel = await usersRepository.create(dataUser);
      await linksRepository.create({
        name: 'Link Test',
        original_link: 'http://example.com',
        surname: 'JohnDoe',
        short_link: 'cli.la/JohnDoe',
        hash_link: 'JohnDoe',
        numbers_clicks: 1,
        user: userModel,
      });
      const result = await service.listLinksUser(user, query);

      expect(result).toBeInstanceOf(Result);
      expect(result).toEqual(
        expect.objectContaining({
          data: {
            data: [
              {
                _id: 'id_link_fake',
                create_at: new Date('2022-06-14T17:57:19.534Z'),
                hash_link: 'JohnDoe',
                name: 'Link Test',
                numbers_clicks: 1,
                original_link: 'http://example.com',
                short_link: 'cli.la/JohnDoe',
                status: 'ACTIVE',
                surname: 'JohnDoe',
                update_at: new Date('2022-06-14T17:57:19.534Z'),
                user: {
                  __v: 1,
                  _id: 'id_fake',
                  api_token: 'fake',
                  email: 'fake@example',
                  password: 'passwordFake',
                },
              },
            ],
            total_pages: 1,
            count: 1,
          },
        }),
      );
    });
  });

  describe('TEST METHOD: listLinkUser', () => {
    it('should return success', async () => {
      const dataUser = {
        _id: 'id_fake',
        email: 'fake@example',
        password: 'passwordFake',
        api_token: 'fake',
        __v: 1,
      } as User;
      const userModel = await usersRepository.create(dataUser);
      await linksRepository.create({
        name: 'Link Test',
        original_link: 'http://example.com',
        surname: 'JohnDoe',
        short_link: 'cli.la/JohnDoe',
        hash_link: 'JohnDoe',
        numbers_clicks: 1,
        user: userModel,
      });
      const result = await service.listLinkUser('id_link_fake');

      expect(result).toBeInstanceOf(Result);
      expect(result).toEqual(
        expect.objectContaining({
          data: {
            _id: 'id_link_fake',
            name: 'Link Test',
            original_link: 'http://example.com',
            surname: 'JohnDoe',
            short_link: 'cli.la/JohnDoe',
            hash_link: 'JohnDoe',
            numbers_clicks: 1,
            user: {
              _id: 'id_fake',
              email: 'fake@example',
              password: 'passwordFake',
              api_token: 'fake',
              __v: 1,
            },
            status: 'ACTIVE',
            create_at: new Date('2022-06-14T17:57:19.534Z'),
            update_at: new Date('2022-06-14T17:57:19.534Z'),
          },
        }),
      );
    });
  });
  describe('TEST METHOD: updateLink', () => {
    it('should return exception if the link does not exist', async () => {
      const result = service.updateLink(
        'id_link_fake',
        {
          name: 'fake',
          short_link: 'fake',
          hash_link: 'fake',
        },
        'en',
      );
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      await expect(result).rejects.toThrow('links.ERROR_LINK_NOT_FOUND');
    });

    it('should return exception if the surname is already in use', async () => {
      const dataUser = {
        _id: 'user_fake',
        email: 'fake@example',
        password: 'passwordFake',
        api_token: 'fake',
        __v: 1,
      } as User;
      const userModel = await usersRepository.create(dataUser);
      await linksRepository.create({
        name: 'Link Test',
        original_link: 'http://example.com',
        surname: 'JohnDoe',
        short_link: 'cli.la/JohnDoe',
        hash_link: 'JohnDoe',
        numbers_clicks: 1,
        user: userModel,
      });

      const result = service.updateLink(
        'id_link_fake',
        {
          name: 'fake',
          short_link: 'fake',
          hash_link: 'fake',
          surname: 'JohnDoe',
        },
        'en',
      );
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      await expect(result).rejects.toThrow('links.ERROR_SURNAME');
    });

    it('should return success if you update a link', async () => {
      const dataUser = {
        _id: 'user_fake',
        email: 'fake@example',
        password: 'passwordFake',
        api_token: 'fake',
        __v: 1,
      } as User;
      const userModel = await usersRepository.create(dataUser);
      await linksRepository.create({
        name: 'Link Test',
        original_link: 'http://example.com',
        surname: 'JohnDoe',
        short_link: 'cli.la/JohnDoe',
        hash_link: 'JohnDoe',
        numbers_clicks: 1,
        user: userModel,
      });

      const result = await service.updateLink(
        'id_link_fake',
        {
          name: 'fake',
          short_link: 'fake',
          hash_link: 'fake',
        },
        'en',
      );
      expect(result).toBeInstanceOf(Result);
      expect(result).toEqual(
        expect.objectContaining({
          data: {},
          errors: null,
          message: 'links.LINK_UPDATED_SUCCESS',
          success: true,
        }),
      );
    });
  });

  describe('TEST METHOD: downloadLinks', () => {
    it('should return not found if there is no user', async () => {
      const result = service.downloadLinks(user);

      await expect(result).rejects.toBeInstanceOf(ForbiddenException);
    });
    it('should return success', async () => {
      const dataUser = {
        _id: 'id_fake',
        email: 'fake@example',
        password: 'passwordFake',
        api_token: 'fake',
        __v: 1,
      } as User;
      const userModel = await usersRepository.create(dataUser);
      await linksRepository.create({
        name: 'Link Test',
        original_link: 'http://example.com',
        surname: 'JohnDoe',
        short_link: 'cli.la/JohnDoe',
        hash_link: 'JohnDoe',
        numbers_clicks: 1,
        user: userModel,
      });
      const result = await service.downloadLinks(user);

      expect(result).toBeInstanceOf(Result);
      expect(result).toEqual(
        expect.objectContaining({
          data: [
            {
              _id: 'id_link_fake',
              name: 'Link Test',
              original_link: 'http://example.com',
              surname: 'JohnDoe',
              short_link: 'cli.la/JohnDoe',
              hash_link: 'JohnDoe',
              numbers_clicks: 1,
              user: {
                _id: 'id_fake',
                email: 'fake@example',
                password: 'passwordFake',
                api_token: 'fake',
                __v: 1,
              },
              status: 'ACTIVE',
              create_at: new Date('2022-06-14T17:57:19.534Z'),
              update_at: new Date('2022-06-14T17:57:19.534Z'),
            },
          ],
        }),
      );
    });
  });

  describe('TEST METHOD: listGroupRefs', () => {
    it('should return not found if there is no user', async () => {
      const result = service.listGroupRefs(user, query);

      await expect(result).rejects.toBeInstanceOf(ForbiddenException);
    });
    it('should return success', async () => {
      const dataUser = {
        _id: 'id_fake',
        email: 'fake@example',
        password: 'passwordFake',
        api_token: 'fake',
        __v: 1,
      } as User;
      const userModel = await usersRepository.create(dataUser);
      await linksRepository.create({
        name: 'Link Test',
        original_link: 'http://example.com',
        surname: 'JohnDoe',
        short_link: 'cli.la/JohnDoe',
        hash_link: 'JohnDoe',
        numbers_clicks: 1,
        user: userModel,
        group_ref: true,
      });
      const result = await service.listGroupRefs(user, query);
      expect(result).toBeInstanceOf(Result);
      expect(result).toEqual(
        expect.objectContaining({
          data: [
            {
              _id: 'id_link_fake',
              name: 'Link Test',
              original_link: 'http://example.com',
              surname: 'JohnDoe',
              short_link: 'cli.la/JohnDoe',
              hash_link: 'JohnDoe',
              numbers_clicks: 1,
              user: {
                _id: 'id_fake',
                email: 'fake@example',
                password: 'passwordFake',
                api_token: 'fake',
                __v: 1,
              },
              group_ref: true,
              status: 'ACTIVE',
              create_at: new Date('2022-06-14T17:57:19.534Z'),
              update_at: new Date('2022-06-14T17:57:19.534Z'),
            },
          ],
        }),
      );
    });
  });

  describe('TEST METHOD: createShortLandpage', () => {
    it('should create', async () => {
      const dataShortLandpage = {
        original_link: 'http://example.com',
        surname: 'JohnDoe',
      } as CreateLinkDto;
      await hashesRepository.create({
        hash: 'hash',
        hash_length: 6,
        in_use: false,
        permanent: false,
        created_at: new Date('2022-06-14T17:57:19.534Z'),
        updated_at: new Date('2022-06-14T17:57:19.534Z'),
      });
      const result = await service.createShortLandpage(dataShortLandpage);
      expect(result).toBeInstanceOf(Result);
      expect(result).toEqual(
        expect.objectContaining({
          data: {
            short_link: 'https://cli.la/hash',
            id: 'id_link_fake',
            original_link: 'https://example.com',
          },
        }),
      );
    });
  });

  describe('TEST METHOD: inactivateLink', () => {
    it('should create', async () => {
      const dataUser = {
        _id: 'id_fake',
        email: 'fake@example',
        password: 'passwordFake',
        api_token: 'fake',
        __v: 1,
      } as User;
      const userModel = await usersRepository.create(dataUser);
      await linksRepository.create({
        name: 'Link Test',
        original_link: 'http://example.com',
        surname: 'JohnDoe',
        short_link: 'cli.la/JohnDoe',
        hash_link: 'JohnDoe',
        numbers_clicks: 1,
        user: userModel,
        group_ref: true,
      });
      const result = await service.inactivateLink('id_link_fake', 'en');
      expect(result).toBeInstanceOf(Result);
      expect(result).toEqual(
        expect.objectContaining({
          message: 'links.LINK_INACTIVATED',
        }),
      );
    });
  });

  describe('TEST METHOD: activateLink', () => {
    it('should return an exception if the link does not exist', async () => {
      const result = service.activateLink('dataShortLandpage', 'en');
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      await expect(result).rejects.toThrow('links.LINK_NOT_FOUND');
    });
    it('should return exception if the link is expired', async () => {
      const dataUser = {
        _id: 'id_fake',
        email: 'fake@example',
        password: 'passwordFake',
        api_token: 'fake',
        __v: 1,
      } as User;
      const userModel = await usersRepository.create(dataUser);
      await linksRepository.create({
        name: 'Link Test',
        original_link: 'http://example.com',
        surname: 'JohnDoe',
        short_link: 'cli.la/JohnDoe',
        hash_link: 'JohnDoe',
        numbers_clicks: 1,
        user: userModel,
        group_ref: true,
        expired_at: new Date(),
      });
      const result = service.activateLink('id_link_fake', 'en');
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      await expect(result).rejects.toThrow('links.LINK_HAS_BEEN_EXPIRED');
    });
    it('should return success if you activate the link', async () => {
      const dataUser = {
        _id: 'id_fake',
        email: 'fake@example',
        password: 'passwordFake',
        api_token: 'fake',
        __v: 1,
      } as User;
      const userModel = await usersRepository.create(dataUser);
      await linksRepository.create({
        name: 'Link Test',
        original_link: 'http://example.com',
        surname: 'JohnDoe',
        short_link: 'cli.la/JohnDoe',
        hash_link: 'JohnDoe',
        numbers_clicks: 1,
        user: userModel,
        group_ref: true,
      });
      const result = await service.activateLink('id_link_fake', 'en');
      expect(result).toBeInstanceOf(Result);
      expect(result).toEqual(
        expect.objectContaining({
          message: 'links.LINK_ACTIVATED',
        }),
      );
    });
  });

  describe('TEST METHOD: removeLink', () => {
    it('should return success if remove link', async () => {
      await hashesRepository.create({
        hash: 'hash',
        hash_length: 6,
        in_use: false,
        permanent: false,
        created_at: new Date('2022-06-14T17:57:19.534Z'),
        updated_at: new Date('2022-06-14T17:57:19.534Z'),
      });
      const dataUser = {
        _id: 'id_fake',
        email: 'fake@example',
        password: 'passwordFake',
        api_token: 'fake',
        __v: 1,
      } as User;
      const userModel = await usersRepository.create(dataUser);
      await linksRepository.create({
        name: 'Link Test',
        original_link: 'http://example.com',
        surname: 'JohnDoe',
        short_link: 'cli.la/JohnDoe',
        hash_link: 'hash',
        numbers_clicks: 1,
        user: userModel,
        group_ref: true,
      });
      const result = await service.removeLink('id_link_fake', 'en');
      expect(result).toBeInstanceOf(Result);
      expect(result).toEqual(
        expect.objectContaining({
          message: 'links.LINK_REMOVED',
        }),
      );
    });
  });

  describe('TEST METHOD: listLinksInfos', () => {
    it('should return link information', async () => {
      const dataUser = {
        _id: 'id_fake',
        email: 'fake@example',
        password: 'passwordFake',
        api_token: 'fake',
        __v: 1,
      } as User;
      const userModel = await usersRepository.create(dataUser);
      const link = await linksRepository.create({
        name: 'Link Test',
        original_link: 'http://example.com',
        surname: 'JohnDoe',
        short_link: 'cli.la/JohnDoe',
        hash_link: 'hash',
        numbers_clicks: 1,
        user: userModel,
        group_ref: true,
      });
      await linksRepository.createLinkInfo({
        ip: '127.0.0.1',
        link: link,
        create_at: new Date('2022-06-15T14:37:58.712Z'),
      });
      const result = await service.listLinksInfos('id_link_fake');
      expect(result).toEqual(
        expect.arrayContaining([
          {
            _id: 'infos_fake',
            ip: '127.0.0.1',
            link: {
              _id: 'id_link_fake',
              name: 'Link Test',
              original_link: 'http://example.com',
              surname: 'JohnDoe',
              short_link: 'cli.la/JohnDoe',
              hash_link: 'hash',
              numbers_clicks: 1,
              user: {
                __v: 1,
                _id: 'id_fake',
                api_token: 'fake',
                email: 'fake@example',
                password: 'passwordFake',
              },
              group_ref: true,
              status: 'ACTIVE',
              create_at: new Date('2022-06-14T17:57:19.534Z'),
              update_at: new Date('2022-06-14T17:57:19.534Z'),
            },
            create_at: new Date('2022-06-15T14:37:58.712Z'),
          },
        ]),
      );
    });
  });
});
