import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LINK_CLICKED_EVENT_NAME } from './app.constants';
import { LinkClickedEvent } from './events/link-clicked.event';
import { Link } from './modules/links/models/link.model';
import { LinkRepository } from './modules/links/repositories/implementations/link.repository';
import { ILinkRepository } from './modules/links/repositories/link-repository.interface';
import { Result } from './shared/models/result';
import RedisProvider from './shared/providers/RedisProvider/implementations/RedisProvider';

@Injectable()
export class AppService {
  constructor(
    @Inject(LinkRepository)
    private readonly linksRepository: ILinkRepository,
    private readonly redisProvider: RedisProvider,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  public async redirectOriginalLink(hash: string, res, ip: string) {
    const cachedLink = await this.redisProvider.recover<Link>(`links:${hash}`);

    if (!!cachedLink) {
      const event = new LinkClickedEvent();
      event.ip = ip;
      event.link = cachedLink;
      this.eventEmitter.emit(LINK_CLICKED_EVENT_NAME, event);
      return res.redirect(`${cachedLink.original_link}`);
    }

    const link = await this.linksRepository.findActiveByHash(hash);

    if (!link || link.active === false) {
      if (process.env.NODE_ENV === 'DEV') {
        return res.redirect('https://site.cli.la');
      } else {
        return res.redirect('https://site.cli.la');
      }
    }

    await this.redisProvider.save(`links:${hash}`, link);

    const event = new LinkClickedEvent();
    event.ip = ip;
    event.link = link;

    this.eventEmitter.emit(LINK_CLICKED_EVENT_NAME, event);

    return res.redirect(`${link.original_link}`);
  }
}
