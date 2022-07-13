import { Test, TestingModule } from '@nestjs/testing';
import { FakeLinkRepository } from '../../../links/repositories/fakes/link.fake.repository';
import { LinkRepository } from '../../../links/repositories/implementations/link.repository';
import { FakeUserRepository } from '../../../users/repositories/fakes/user.fake.repository';
import { UserRepository } from '../../../users/repositories/implementation/user.repository';
import { ILinkRepository } from '../../../links/repositories/link-repository.interface';
import { IUserRepository } from '../../../users/repositories/user-repository.interface';
import { DashboardService } from './read.service';
import { IUserTokenDto } from '../../../auth/dtos/user-token.dto';
import { User } from '../../../users/models/users.model';

describe('DashboardService', () => {
  let service: DashboardService;
  let linksRepository: ILinkRepository;
  let usersRepository: IUserRepository;

  const user = {
    email: 'teste@teste',
    id: 'id_fake',
  } as IUserTokenDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: LinkRepository,
          useClass: FakeLinkRepository,
        },
        {
          provide: UserRepository,
          useClass: FakeUserRepository,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    linksRepository = module.get<ILinkRepository>(LinkRepository);
    usersRepository = module.get<IUserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('TEST METHOD: dashboard', () => {
    it('should return success', async () => {
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
        hash_link: 'JohnDoe',
        numbers_clicks: 1,
        user: userModel,
        create_at: new Date('2022-06-16T14:47:40.848Z'),
      });
      await linksRepository.createLinkInfo({
        ip: '127.0.0.1',
        link: link,
        create_at: new Date('2022-06-16T14:47:40.848Z'),
      });
      const result = await service.dashboard(user);
      expect(result).toEqual(
        expect.objectContaining({
          total_links: 1,
          total_days_clicks: 1,
          infosWeek: [
            {
              _id: 'infos_fake',
              ip: '127.0.0.1',
              link: {
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
              create_at: new Date('2022-06-16T14:47:40.848Z'),
            },
          ],
          infosMonth: [
            {
              _id: 'infos_fake',
              ip: '127.0.0.1',
              link: {
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
              create_at: new Date('2022-06-16T14:47:40.848Z'),
            },
          ],
        }),
      );
    });
  });
});
