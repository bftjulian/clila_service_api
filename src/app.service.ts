import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { LinkRepository } from './modules/links/repositories/implementations/link.repository';
import { ILinkRepository } from './modules/links/repositories/link-repository.interface';
import { Result } from './shared/models/result';

@Injectable()
export class AppService {
  constructor(
    @Inject(LinkRepository)
    private readonly linksRepository: ILinkRepository,
  ) {}
  public async redirectOriginalLink(hash: string, res) {
    const link = await this.linksRepository.findByHash(hash);

    if (!link) {
      if (process.env.NODE_ENV === 'DEV') {
        return res.redirect('https://site.cli.la');
      } else {
        return res.redirect('https://site.cli.la');
      }
    }
    try {
      await this.linksRepository.setClickLink(link._id);
      return res.redirect(`${link.original_link}`);
    } catch (error) {
      throw new BadRequestException(
        new Result('Error in transaction', false, {}, null),
      );
    }
  }
}
