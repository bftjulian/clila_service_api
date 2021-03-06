import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
// import { InjectModel } from '@nestjs/mongoose';
import { I18nService } from 'nestjs-i18n';
import { IUserTokenDto } from '../../../auth/dtos/user-token.dto';
import { UserRepository } from '../../../users/repositories/implementation/user.repository';
import { IUserRepository } from '../../../users/repositories/user-repository.interface';
import { Result } from 'src/shared/models/result';
import RedisProvider from '../../../../shared/providers/RedisProvider/implementations/RedisProvider';
import { generateHash } from 'src/utils/generate-hash';
import { CreateLinkDto } from '../../dtos/create-link.dto';
// import { PaginationParamsDto } from '../../dtos/pagination-params.dto';
import { UpdateLinkDto } from '../../dtos/update-link.dto';
import { LinkCreatedEvent } from '../../events/link-created.event';
import {
  FREE_SIX_DIGITS_HASHES_REDIS_KEY,
  LINK_CREATED_EVENT_NAME,
  MALICIOUS_URLS,
  USED_HASHES_TO_UPDATE_REDIS_KEY,
} from '../../links.constants';
import { HashRepository } from '../../repositories/implementations/hash.repository';
import { LinkRepository } from '../../repositories/implementations/link.repository';
import { ILinkRepository } from '../../repositories/link-repository.interface';
import { QueryDto } from '../../../../shared/dtos/query.dto';
import { urlNormalize } from '../../../../utils/urlNormalize';
import { MaliciousContentCheckProvider } from 'src/shared/providers/MaliciousContentCheckProvider/implementations/malicious-content-check.provider';
import { ICheckResult } from 'src/shared/providers/MaliciousContentCheckProvider/models/check-result.interface';

@Injectable()
export class LinksService {
  constructor(
    @Inject(LinkRepository)
    private readonly linksRepository: ILinkRepository,
    @Inject(UserRepository)
    private readonly usersRepository: IUserRepository,
    private readonly i18n: I18nService,
    private readonly redisProvider: RedisProvider,
    private readonly hashRepository: HashRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  public async create(data: CreateLinkDto, user: IUserTokenDto, lang: string) {
    data.original_link = await this.formatLink(data.original_link);
    data.original_link = urlNormalize(data.original_link);
    if (data.surname) {
      await this.formatSurname(data.surname, 6, lang);
      data.hash_link = data.surname;
      const surname_link = await this.linksRepository.findActiveByHash(
        data.hash_link,
      );
      if (surname_link) {
        throw new BadRequestException(
          new Result(
            await this.i18n.translate('links.ERROR_SURNAME', {
              lang,
            }),
            false,
            {},
            null,
          ),
        );
      }
      if (process.env.NODE_ENV === 'DEV') {
        data.short_link = 'http://localhost:3000/' + data.surname;
      } else {
        data.short_link = 'https://cli.la/' + data.surname;
      }
    } else {
      let hash = await this.redisProvider.lpop(
        FREE_SIX_DIGITS_HASHES_REDIS_KEY,
      );
      if (!hash) {
        const dbHash = await this.hashRepository.getOneFreeHash(6);
        hash = dbHash.hash;
      }

      data.hash_link = hash;
      if (process.env.NODE_ENV === 'DEV') {
        data.short_link = 'http://localhost:3000/' + hash;
      } else {
        data.short_link = 'https://cli.la/' + hash;
      }
    }

    const userModel = await this.usersRepository.findById(user.id);

    if (!userModel) {
      throw new ForbiddenException('');
    }
    data.user = userModel;
    try {
      const createLink = await this.linksRepository.create(data);
      await this.redisProvider.save(
        `links:${createLink.hash_link}`,
        createLink,
      );

      if (!data.surname) {
        await this.redisProvider.lpush(
          USED_HASHES_TO_UPDATE_REDIS_KEY,
          createLink.hash_link,
        );
      }

      const event = new LinkCreatedEvent();
      event.surname = data.surname;

      this.eventEmitter.emit(LINK_CREATED_EVENT_NAME, event);
      return new Result(
        '',
        true,
        {
          short_link: data.short_link,
          id: createLink._id,
          original_link: data.original_link,
        },
        null,
      );
    } catch (error) {
      throw new BadRequestException(
        new Result('Error in transaction', false, {}, null),
      );
    }
  }

  public async listLinksUser(user: IUserTokenDto, query: QueryDto) {
    const userModel = await this.usersRepository.findById(user.id);
    if (!userModel) {
      throw new ForbiddenException('');
    }
    const links = await this.linksRepository.findAllByUserWithQuery(
      userModel,
      query,
    );
    return new Result('', true, links, null);
  }

  public async listLinkUser(id: string) {
    const link = await this.linksRepository.findById(id);
    return new Result('', true, link, null);
  }

  public async updateLink(id: string, data: UpdateLinkDto, lang: string) {
    const link = await this.linksRepository.findById(id);

    if (!link) {
      throw new BadRequestException(
        new Result(
          await this.i18n.translate('links.ERROR_LINK_NOT_FOUND', {
            lang,
          }),
          false,
          {},
          null,
        ),
      );
    }

    await this.redisProvider.delete(`links:${link.hash_link}`);

    if (data.surname) {
      data.hash_link = data.surname;
      const isUsed = await this.hashRepository.isUsed(data.hash_link);
      const surname_link = await this.linksRepository.findActiveByHash(
        data.hash_link,
      );
      if (surname_link || isUsed) {
        throw new BadRequestException(
          new Result(
            await this.i18n.translate('links.ERROR_SURNAME', {
              lang,
            }),
            false,
            {},
            null,
          ),
        );
      }
      await this.hashRepository.setUsed(data.hash_link);

      if (process.env.NODE_ENV === 'DEV') {
        data.short_link = 'http://localhost:3000/' + data.surname;
      } else {
        data.short_link = 'https://cli.la/' + data.surname;
      }
    }
    try {
      await this.linksRepository.setNameSurname(id, data);
      return new Result(
        await this.i18n.translate('links.LINK_UPDATED_SUCCESS', {
          lang,
        }),
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

  // public async updateLinkApiToken(
  //   data: UpdateLinkDto,
  //   lang: string,
  //   id: string,
  // ) {
  //   if (data.surname) {
  //     data.hash_link = data.surname;
  //     const surname_link = await this.linksRepository.findByHash(
  //       data.hash_link,
  //     );
  //     if (surname_link) {
  //       throw new BadRequestException(
  //         new Result(
  //           await this.i18n.translate('links.ERROR_SURNAME', {
  //             lang,
  //           }),
  //           false,
  //           {},
  //           null,
  //         ),
  //       );
  //     }
  //     if (process.env.NODE_ENV === 'DEV') {
  //       data.short_link = 'http://localhost:3000/' + data.surname;
  //     } else {
  //       data.short_link = 'https://cli.la/' + data.surname;
  //     }
  //   }
  //   try {
  //     await this.linksRepository.setNameSurname(id, data);
  //     return new Result(
  //       await this.i18n.translate('links.LINK_UPDATED_SUCCESS', {
  //         lang,
  //       }),
  //       true,
  //       {},
  //       null,
  //     );
  //   } catch (error) {
  //     throw new BadRequestException(
  //       new Result('Error in transaction', false, {}, null),
  //     );
  //   }
  // }
  public async downloadLinks(user: IUserTokenDto) {
    const userModel = await this.usersRepository.findById(user.id);
    if (!userModel) {
      throw new ForbiddenException('');
    }
    const links = await this.linksRepository.findAllByUserDownload(userModel);
    return new Result('', true, links, null);
  }

  public async listGroupRefs(user: IUserTokenDto, query: QueryDto) {
    const userModel = await this.usersRepository.findById(user.id);
    if (!userModel) {
      throw new ForbiddenException('');
    }

    const refs = await this.linksRepository.findAllGroupRefByUser(
      userModel,
      query,
    );
    return new Result('', true, refs, null);
  }

  public async createShortLandpage(data: CreateLinkDto) {
    data.original_link = await this.formatLink(data.original_link);

    let hash = await this.redisProvider.lpop(FREE_SIX_DIGITS_HASHES_REDIS_KEY);
    if (!hash) {
      const dbHash = await this.hashRepository.getOneFreeHash(6);
      hash = dbHash.hash;
    }

    data.hash_link = hash;
    if (process.env.NODE_ENV === 'DEV') {
      data.short_link = 'http://localhost:3000/' + hash;
    } else {
      data.short_link = 'https://cli.la/' + hash;
    }

    try {
      const createLink = await this.linksRepository.create(data);
      await this.redisProvider.save(
        `links:${createLink.hash_link}`,
        createLink,
      );

      await this.redisProvider.lpush(
        USED_HASHES_TO_UPDATE_REDIS_KEY,
        createLink.hash_link,
      );

      const event = new LinkCreatedEvent();
      event.surname = data.surname;

      this.eventEmitter.emit(LINK_CREATED_EVENT_NAME, event);
      return new Result(
        '',
        true,
        {
          short_link: data.short_link,
          id: createLink._id,
          original_link: data.original_link,
        },
        null,
      );
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        new Result('Error in transaction', false, {}, null),
      );
    }
  }

  // public async listAllLinksApiToken(apiToken: string, lang, query: QueryDto) {
  //   const user = await this.usersRepository.findByApiTokenPanel(apiToken);
  //   const links = await this.linksRepository.findAllByUserWithQuery(
  //     user,
  //     query,
  //   );
  //   return links;
  // }

  // public async createShortLinkApiToken(
  //   data: CreateLinkDto,
  //   apiToken: string,
  //   lang: string,
  // ) {
  //   data.original_link = await this.formatLink(data.original_link);

  //   if (data.surname) {
  //     await this.formatSurname(data.surname, 6, lang);

  //     data.hash_link = data.surname;
  //     const surname_link = await this.linksRepository.findByHash(
  //       data.hash_link,
  //     );
  //     if (surname_link) {
  //       throw new BadRequestException(
  //         new Result(
  //           await this.i18n.translate('links.ERROR_SURNAME', {
  //             lang,
  //           }),
  //           false,
  //           {},
  //           null,
  //         ),
  //       );
  //     }
  //     if (process.env.NODE_ENV === 'DEV') {
  //       data.short_link = 'http://localhost:3000/' + data.surname;
  //     } else {
  //       data.short_link = 'https://cli.la/' + data.surname;
  //     }
  //   } else {
  //     let hash = '';
  //     while (true) {
  //       hash = generateHash(6).toString();
  //       data.hash_link = hash;
  //       const hash_link = await this.linksRepository.findByHash(data.hash_link);
  //       if (!hash_link) {
  //         break;
  //       }
  //     }
  //     if (process.env.NODE_ENV === 'DEV') {
  //       data.short_link = 'http://localhost:3000/' + hash;
  //     } else {
  //       data.short_link = 'https://cli.la/' + hash;
  //     }
  //   }

  //   const user = await this.usersRepository.findByApiTokenPanel(apiToken);

  //   if (!user) {
  //     throw new ForbiddenException('');
  //   }
  //   data.user = user;
  //   try {
  //     const createLink = await this.linksRepository.create(data);
  //     return new Result(
  //       '',
  //       true,
  //       {
  //         short_link: data.short_link,
  //         id: createLink._id,
  //         original_link: data.original_link,
  //       },
  //       null,
  //     );
  //   } catch (error) {
  //     throw new BadRequestException(
  //       new Result('Error in transaction', false, {}, null),
  //     );
  //   }
  // }

  public async inactivateLink(id: string, lang: string) {
    try {
      const link = await this.linksRepository.findById(id);

      if (link) await this.redisProvider.delete(`links:${link.hash_link}`);

      await this.linksRepository.setStatusLink(id, false);

      return new Result(
        await this.i18n.translate('links.LINK_INACTIVATED', {
          lang,
        }),
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

  public async activateLink(id: string, lang: string) {
    try {
      const link = await this.linksRepository.findById(id);

      if (!link) {
        throw new BadRequestException(
          new Result(
            await this.i18n.translate('LINK_NOT_FOUND', { lang }),
            false,
            {},
            null,
          ),
        );
      }

      if (!!link.expired_at) {
        throw new BadRequestException(
          new Result(
            await this.i18n.translate('LINK_HAS_BEEN_EXPIRED', { lang }),
            false,
            {},
            null,
          ),
        );
      }

      await this.linksRepository.setStatusLink(id, true);
      await this.redisProvider.save(`links:${link.hash_link}`, link);
      return new Result(
        await this.i18n.translate('links.LINK_ACTIVATED', {
          lang,
        }),
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

  public async removeLink(id: string, lang: string) {
    try {
      const link = await this.linksRepository.findById(id);

      await this.linksRepository.removeLinkById(id);

      if (link) {
        await this.hashRepository.setUnused(link.hash_link);
        await this.redisProvider.delete(`links:${link.hash_link}`);
      }

      return new Result(
        await this.i18n.translate('links.LINK_REMOVED', {
          lang,
        }),
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

  public async listLinksInfos(id) {
    const link = await this.linksRepository.findById(id);
    if (link) {
      return await this.linksRepository.findAllLinkInfosByLink(link);
    }
    return false;
  }

  private async formatSurname(surname, minLength, lang) {
    if (surname.length < minLength) {
      throw new BadRequestException(
        new Result(
          'The minimum number of characters allowed is 6',
          false,
          {},
          null,
        ),
      );
    }
    const regex = /([@!#$%^&*()/\\'="`{}~:;><])/g;
    if (surname.match(regex)) {
      throw new BadRequestException(
        new Result(
          await this.i18n.translate('links.CHARACTERES_INVALID', {
            lang,
          }),
          false,
          {},
          null,
        ),
      );
    }
  }

  private async formatLink(link: string) {
    if (link.indexOf('http//') >= 0) {
      link = link.replace('http//', '');
    }
    if (link.indexOf('https//') >= 0) {
      link = link.replace('https//', '');
    }
    if (link.indexOf('https') === -1) {
      const regex = new RegExp('^(http|https)://', 'i');
      link = link.replace(regex, '');
      if (link.indexOf('http') >= 0) {
        link = 'https://' + link;
      } else {
        link = 'https://' + link;
      }
    }
    return link;
  }
}
