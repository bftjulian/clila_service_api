import { Inject, Injectable } from '@nestjs/common';
import { Link } from '../../models/link.model';
import { LinkRepository } from '../../repositories/implementations/link.repository';
import { ILinkRepository } from '../../repositories/link-repository.interface';

@Injectable()
export class LinksService {
  constructor(
    @Inject(LinkRepository)
    private readonly linksRepository: ILinkRepository,
  ) {}

  public async create(data): Promise<Link> {
    return this.linksRepository.create(data);
  }
}
