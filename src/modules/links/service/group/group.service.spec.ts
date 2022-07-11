import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';
import { FakeQueue } from '../../../../shared/fakes/queue.fake';
import { FakeUserRepository } from '../../../../modules/users/repositories/fakes/user.fake.repository';
import { UserRepository } from '../../../../modules/users/repositories/implementation/user.repository';
import FakeRedisProvider from '../../../../shared/providers/RedisProvider/fakes/FakeRedisProvider';
import RedisProvider from '../../../../shared/providers/RedisProvider/implementations/RedisProvider';
import {
  FREE_SIX_DIGITS_HASHES_REDIS_KEY,
  LINKS_BATCH_PROCESSOR,
  LINKS_SHORT_MULTIPLE_PROCESSOR,
} from '../../links.constants';
import { FakeGroupRepository } from '../../repositories/fakes/group.fake.repository';
import { FakeLinkRepository } from '../../repositories/fakes/link.fake.repository';
import { GroupRepository } from '../../repositories/implementations/group.repository';
import { LinkRepository } from '../../repositories/implementations/link.repository';
import { GroupService } from './group.service';
import { BadRequestException } from '@nestjs/common';
import { IUserTokenDto } from '../../../../modules/auth/dtos/user-token.dto';
import { CreateGroupDto } from '../../dtos/create-group.dto';
import { User } from '../../../../modules/users/models/users.model';
import { IUserRepository } from '../../../../modules/users/repositories/user-repository.interface';
import { Result } from '../../../../shared/models/result';
import { CreateBatchLinksDto } from '../../dtos/create-batch-links-group.dto';
import { IGroupRepository } from '../../repositories/group-repository.interface';
import IRedisProvider from '../../../../shared/providers/RedisProvider/models/IRedisProvider';
import { ConfigService } from '@nestjs/config';
import { QueryDto } from 'src/shared/dtos/query.dto';
import { ILinkRepository } from '../../repositories/link-repository.interface';
import { CreateShortLinkListsDto } from '../../dtos/create-short-links-lists.dto';
const config = {
  BATCH_LINKS_RATE: 10000,
  SHORT_MULTIPLE_LINKS_RATE: 10000,
};

const configServiceMock = {
  get: jest.fn().mockImplementation((key: string) => {
    if (!config.hasOwnProperty(key)) return null;
    return config[key];
  }),
};
describe('GroupService', () => {
  let service: GroupService;
  let usersRepository: IUserRepository;
  let groupRepository: IGroupRepository;
  let redisRepository: IRedisProvider;
  let linksRepository: ILinkRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        {
          provide: LinkRepository,
          useClass: FakeLinkRepository,
        },
        {
          provide: GroupRepository,
          useClass: FakeGroupRepository,
        },
        {
          provide: UserRepository,
          useClass: FakeUserRepository,
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
        {
          provide: `BullQueue_${LINKS_BATCH_PROCESSOR}`,
          useClass: FakeQueue,
        },
        {
          provide: `BullQueue_${LINKS_SHORT_MULTIPLE_PROCESSOR}`,
          useClass: FakeQueue,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    service = module.get<GroupService>(GroupService);
    usersRepository = module.get<IUserRepository>(UserRepository);
    groupRepository = module.get<IGroupRepository>(GroupRepository);
    redisRepository = module.get<IRedisProvider>(RedisProvider);
    linksRepository = module.get<ILinkRepository>(LinkRepository);

    const dataUser = {
      _id: 'id_fake',
      email: 'foo@example.com',
      password: 'passwordFake',
      api_token: 'fake',
      __v: 1,
    } as User;
    await usersRepository.create(dataUser);
  });
  const user: IUserTokenDto = { email: 'foo@example.com', id: 'id_fake' };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('TEST METHOD: createGroup', () => {
    it('should return exception if there is no user', async () => {
      const result = service.createGroup(
        {} as IUserTokenDto,
        {} as CreateGroupDto,
        'en',
      );

      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      await expect(result).rejects.toThrow('users.NOT_FOUND_USER');
    });

    it('should return success if you create a group', async () => {
      const data = {
        name: 'string',
        links: [],
        original_link: 'string',
        tags: ['tag'],
      } as CreateGroupDto;
      const result = await service.createGroup(user, data, 'en');
      expect(result).toBeInstanceOf(Result);
      expect(result).toEqual(
        expect.objectContaining({
          message: 'groups.SUCCESS_CREATE',
          success: true,
          data: {
            _id: 'group_fake',
            name: 'string',
            links: [],
            original_link: 'https://string',
            tags: ['tag'],
            user: null,
            total_clicks: 1,
            created_at: new Date('2022-06-28T13:23:09.491Z'),
            updated_at: new Date('2022-06-28T13:23:09.491Z'),
          },
          errors: null,
        }),
      );
    });
  });

  describe('TEST METHOD: batchLinksCreate', () => {
    it('should return exception if there is no group', async () => {
      const result = service.batchLinksCreate(
        {} as IUserTokenDto,
        'id',
        {} as CreateBatchLinksDto,
        'en',
      );
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
    });
    it('should return exception if there is no group', async () => {
      const dataGroup = {
        name: 'string',
        links: [],
        original_link: 'string',
        tags: ['tag'],
      } as CreateGroupDto;
      await groupRepository.create(dataGroup);
      const data: CreateBatchLinksDto = { count: 12 };
      await redisRepository.lpush(FREE_SIX_DIGITS_HASHES_REDIS_KEY, 'hashes');
      const result = await service.batchLinksCreate(
        user,
        'group_fake',
        data,
        'en',
      );
      expect(result).toEqual(expect.arrayContaining(['https://cli.la/hashes']));
    });
  });

  describe('TEST METHOD: listLinksGroups', () => {
    it('should return exception if there is no group', async () => {
      const result = service.listLinksGroups('id', {} as QueryDto, 'en');
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      await expect(result).rejects.toThrow('groups.GROUP_NOT_FOUND');
    });

    it('should return success', async () => {
      const dataGroup = {
        name: 'string',
        links: [],
        original_link: 'string',
        tags: ['tag'],
      } as CreateGroupDto;
      const groupModel = await groupRepository.create(dataGroup);
      const dataUser = {
        _id: 'id_fake',
        email: 'foo@example.com',
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
        group: groupModel,
        user: userModel,
      });
      const result = await service.listLinksGroups(
        'group_fake',
        {} as QueryDto,
        'en',
      );
      expect(result).toBeInstanceOf(Result);
      expect(result).toEqual(
        expect.objectContaining({
          data: {
            data: [
              {
                _id: 'id_link_fake',
                name: 'Link Test',
                original_link: 'http://example.com',
                surname: 'JohnDoe',
                short_link: 'cli.la/JohnDoe',
                hash_link: 'JohnDoe',
                numbers_clicks: 1,
                group: {
                  _id: 'group_fake',
                  created_at: new Date('2022-06-28T13:23:09.491Z'),
                  links: [],
                  name: 'string',
                  original_link: 'string',
                  tags: ['tag'],
                  total_clicks: 1,
                  updated_at: new Date('2022-06-28T13:23:09.491Z'),
                },
                user: {
                  __v: 1,
                  _id: 'id_fake',
                  api_token: 'fake',
                  email: 'foo@example.com',
                  password: 'passwordFake',
                },
                status: 'ACTIVE',
                create_at: new Date('2022-06-14T17:57:19.534Z'),
                update_at: new Date('2022-06-14T17:57:19.534Z'),
              },
            ],
            total_pages: 1,
            count: 1,
          },
        }),
      );
    });
  });

  describe('TEST METHOD: listGroups', () => {
    it('should return success', async () => {
      const dataUser = {
        _id: 'user_fake_id',
        email: 'foo@example.com',
        password: 'passwordFake',
        api_token: 'fake',
        __v: 1,
      } as User;
      const userModel = await usersRepository.create(dataUser);
      const dataGroup = {
        name: 'string',
        links: [],
        original_link: 'string',
        tags: ['tag'],
        user: userModel,
        type: 'ONE_ORIGINAL_LINK',
      } as CreateGroupDto;
      await groupRepository.create(dataGroup);
      const result = await service.listGroups(
        {} as QueryDto,
        'en',
        'user_fake_id',
      );
      expect(result).toBeInstanceOf(Result);
      expect(result).toEqual(
        expect.objectContaining({
          data: {
            data: [
              {
                _id: 'group_fake',
                name: 'string',
                links: [],
                original_link: 'string',
                tags: ['tag'],
                type: 'ONE_ORIGINAL_LINK',
                user: {
                  __v: 1,
                  _id: 'user_fake_id',
                  api_token: 'fake',
                  email: 'foo@example.com',
                  password: 'passwordFake',
                },
                total_clicks: 1,
                created_at: new Date('2022-06-28T13:23:09.491Z'),
                updated_at: new Date('2022-06-28T13:23:09.491Z'),
              },
            ],
            total_pages: 1,
            count: 1,
          },
        }),
      );
    });
  });

  describe('TEST METHOD: shortLinksMultiple', () => {
    it('should be an exception if there is no group', async () => {
      const result = service.shortLinksMultiple(
        {} as IUserTokenDto,
        {} as CreateShortLinkListsDto,
        'en',
        'user_fake_id',
      );
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should be exception the group type is different from MULTIPLE_ORIGINAL_LINKS', async () => {
      const dataUser = {
        _id: 'user_fake_id',
        email: 'foo@example.com',
        password: 'passwordFake',
        api_token: 'fake',
        __v: 1,
      } as User;
      const userModel = await usersRepository.create(dataUser);

      const dataGroup = {
        name: 'string',
        links: [],
        original_link: 'string',
        tags: ['tag'],
        user: userModel,
        type: 'ONE_ORIGINAL_LINK',
      } as CreateGroupDto;
      await groupRepository.create(dataGroup);

      const result = service.shortLinksMultiple(
        {} as IUserTokenDto,
        {} as CreateShortLinkListsDto,
        'en',
        'group_fake',
      );
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should be successful if you shorten the links', async () => {
      const dataUser = {
        _id: 'user_fake_id',
        email: 'foo@example.com',
        password: 'passwordFake',
        api_token: 'fake',
        __v: 1,
      } as User;
      const userModel = await usersRepository.create(dataUser);

      const dataGroup = {
        name: 'string',
        links: [],
        original_link: 'string',
        tags: ['tag'],
        user: userModel,
        type: 'MULTIPLE_ORIGINAL_LINKS',
      } as CreateGroupDto;
      await groupRepository.create(dataGroup);
      await redisRepository.lpush(FREE_SIX_DIGITS_HASHES_REDIS_KEY, 'hashes');
      const result = await service.shortLinksMultiple(
        {} as IUserTokenDto,
        { links: ['link.fake', 'link2.fake'] } as CreateShortLinkListsDto,
        'en',
        'group_fake',
      );
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            original_link: 'link.fake',
            short_link: 'https://cli.la/hashes',
            hash: 'hashes',
          }),
        ]),
      );
    });
  });
});
