import { Inject, Injectable } from '@nestjs/common';
import { IUserTokenDto } from 'src/modules/auth/dtos/user-token.dto';
import { Md5 } from 'ts-md5';
import { CreateLinkDto } from '../../dtos/create-link.dto';
import { LinkRepository } from '../../repositories/implementations/link.repository';
import { ILinkRepository } from '../../repositories/link-repository.interface';

@Injectable()
export class LinksService {
  constructor(
    @Inject(LinkRepository)
    private readonly linksRepository: ILinkRepository,
  ) {}

  public async create(data: CreateLinkDto, user: IUserTokenDto) {
    if (data.surname) {
      data.hash_link = data.surname;
      const surname_link = await this.linksRepository.findByHash(
        data.hash_link,
      );
      if (surname_link) {
        return false;
      }
      data.short_link = data.original_link + '/' + data.surname;
    } else {
      const hash = Md5.hashStr(data.original_link + Date())
        .slice(0, 6)
        .toString();
      data.hash_link = hash;
      const hash_link = await this.linksRepository.findByHash(data.hash_link);
      console.log(hash_link);
      if (hash_link) {
        return false;
      }
      data.short_link = data.original_link + '/' + hash;
    }
    data.user = user._id;
    return;
    return this.linksRepository.create(data);
  }
}
