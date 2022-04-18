import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { IUserTokenDto } from 'src/modules/auth/dtos/user-token.dto';
import { UserRepository } from 'src/modules/users/repositories/implementation/user.repository';
import { IUserRepository } from 'src/modules/users/repositories/user-repository.interface';
import { Result } from 'src/shared/models/result';
import { generateHash } from 'src/utils/generate-hash';
import { CreateLinkDto } from '../../dtos/create-link.dto';
import { PaginationParamsDto } from '../../dtos/pagination-params.dto';
import { UpdateLinkDto } from '../../dtos/update-link.dto';
import { LinkRepository } from '../../repositories/implementations/link.repository';
import { ILinkRepository } from '../../repositories/link-repository.interface';
import { QueryDto } from '../../shared/dtos/query.dto';

@Injectable()
export class LinksService {
  constructor(
    @Inject(LinkRepository)
    private readonly linksRepository: ILinkRepository,
    @Inject(UserRepository)
    private readonly usersRepository: IUserRepository,
    private readonly i18n: I18nService,
  ) {}

  public async create(data: CreateLinkDto, user: IUserTokenDto, lang: string) {
    data.original_link = await this.formatLink(data.original_link);
    if (data.surname) {
      await this.formatSurname(data.surname, 6, lang);
      data.hash_link = data.surname;
      const surname_link = await this.linksRepository.findByHash(
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
      let hash = '';
      while (true) {
        hash = generateHash(6).toString();
        data.hash_link = hash;
        const hash_link = await this.linksRepository.findByHash(data.hash_link);
        if (!hash_link) {
          break;
        }
      }
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
    data.create_at = new Date(Date.now());
    data.user = userModel;
    try {
      const createLink = await this.linksRepository.create(data);
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
    if (data.surname) {
      data.hash_link = data.surname;
      const surname_link = await this.linksRepository.findByHash(
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

  public async updateLinkApiToken(
    data: UpdateLinkDto,
    lang: string,
    id: string,
  ) {
    if (data.surname) {
      data.hash_link = data.surname;
      const surname_link = await this.linksRepository.findByHash(
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

  public async downloadLinks(user: IUserTokenDto) {
    const userModel = await this.usersRepository.findById(user.id);
    if (!userModel) {
      throw new ForbiddenException('');
    }
    const links = await this.linksRepository.findAllByUserDownload(userModel);
    return new Result('', true, links, null);
  }

  public async createShortLandpage(data: CreateLinkDto) {
    data.original_link = await this.formatLink(data.original_link);

    let hash = '';
    while (true) {
      hash = generateHash(6).toString();
      data.hash_link = hash;
      const hash_link = await this.linksRepository.findByHash(data.hash_link);
      if (!hash_link) {
        break;
      }
    }
    if (process.env.NODE_ENV === 'DEV') {
      data.short_link = 'http://localhost:3000/' + hash;
    } else {
      data.short_link = 'https://cli.la/' + hash;
    }

    data.create_at = new Date(Date.now());
    try {
      const createLink = await this.linksRepository.create(data);
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

  public async listAllLinksApiToken(apiToken: string, lang, query: QueryDto) {
    const user = await this.usersRepository.findByApiTokenPanel(apiToken);
    const links = await this.linksRepository.findAllByUserWithQuery(
      user,
      query,
    );
    return links;
  }

  public async createShortLinkApiToken(
    data: CreateLinkDto,
    apiToken: string,
    lang: string,
  ) {
    data.original_link = await this.formatLink(data.original_link);

    if (data.surname) {
      await this.formatSurname(data.surname, 6, lang);

      data.hash_link = data.surname;
      const surname_link = await this.linksRepository.findByHash(
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
      let hash = '';
      while (true) {
        hash = generateHash(6).toString();
        data.hash_link = hash;
        const hash_link = await this.linksRepository.findByHash(data.hash_link);
        if (!hash_link) {
          break;
        }
      }
      if (process.env.NODE_ENV === 'DEV') {
        data.short_link = 'http://localhost:3000/' + hash;
      } else {
        data.short_link = 'https://cli.la/' + hash;
      }
    }

    const user = await this.usersRepository.findByApiTokenPanel(apiToken);

    if (!user) {
      throw new ForbiddenException('');
    }
    data.create_at = new Date(Date.now());
    data.user = user;
    try {
      const createLink = await this.linksRepository.create(data);
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

  public async inactivateLink(id: string, lang: string) {
    try {
      const status = false;
      await this.linksRepository.setStatusLink(id, status);
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
      const status = true;
      await this.linksRepository.setStatusLink(id, status);
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
      await this.linksRepository.removeLinkById(id);
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
