import {
  BadRequestException,
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
import { LinkRepository } from '../../repositories/implementations/link.repository';
import { ILinkRepository } from '../../repositories/link-repository.interface';

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
      throw new UnauthorizedException('');
    }
    data.create_at = new Date(Date.now());
    data.user = userModel;
    try {
      await this.linksRepository.create(data);
      return new Result('', true, { short_link: data.short_link }, null);
    } catch (error) {
      throw new BadRequestException(
        new Result('Error in transaction', false, {}, null),
      );
    }
  }

  public async listLinksUser(user: IUserTokenDto, params: PaginationParamsDto) {
    const userModel = await this.usersRepository.findById(user.id);
    if (!userModel) {
      throw new UnauthorizedException('');
    }
    const links = await this.linksRepository.findAllByUser(
      userModel,
      params.limit,
      params.page,
    );
    return new Result('', true, links, null);
  }

  public async listLinkUser(id: string, user: IUserTokenDto) {
    const link = await this.linksRepository.findById(id);
    return new Result('', true, link, null);
  }
}
