import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Response } from 'express';
import { Queue } from 'bull';
import {
  FEED_DATABASE_LINK_COLLECTION,
  LINK_CLICKED_PROCCESSOR_NAME,
} from './app.constants';
import { Link } from './modules/links/models/link.model';
import { LinkRepository } from './modules/links/repositories/implementations/link.repository';
import { ILinkRepository } from './modules/links/repositories/link-repository.interface';
import { ILinkClicks } from './proccessors/jobs/i-link-clicks.job';
import RedisProvider from './shared/providers/RedisProvider/implementations/RedisProvider';
import { urlNormalize } from './utils/urlNormalize';

@Injectable()
export class AppService {
  constructor(
    @Inject(LinkRepository)
    private readonly linksRepository: ILinkRepository,
    private readonly redisProvider: RedisProvider,
    private readonly eventEmitter: EventEmitter2,
    @InjectQueue(LINK_CLICKED_PROCCESSOR_NAME)
    private readonly linksQueue: Queue,
  ) {}
  public async redirectOriginalLink(hash: string, ip: string) {
    const cachedLink = await this.redisProvider.recover<Link>(`links:${hash}`);
    console.log('cache', cachedLink);
    if (!!cachedLink) {
      const event = new ILinkClicks();
      event.ip = ip;
      event.link = cachedLink;
      await this.linksQueue.add(FEED_DATABASE_LINK_COLLECTION, event);
      return urlNormalize(cachedLink.original_link);
    }

    const link = await this.linksRepository.findActiveByHash(hash);

    console.log('link', link);

    if (!link || link.active === false) {
      return 'https://site.cli.la';
    }

    await this.redisProvider.save(`links:${hash}`, link);

    const event = new ILinkClicks();
    event.ip = ip;
    event.link = link;

    await this.linksQueue.add(FEED_DATABASE_LINK_COLLECTION, event);

    return urlNormalize(link.original_link);
  }
}
