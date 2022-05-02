import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import RedisProvider from 'src/shared/providers/RedisProvider/implementations/RedisProvider';
import { Link } from '../models/link.model';
import { HashRepository } from '../repositories/implementations/hash.repository';
import { LinkRepository } from '../repositories/implementations/link.repository';

@Injectable()
export class ImportHashFromLinksTask {
  constructor(
    private readonly linksRepository: LinkRepository,
    private readonly hashRepository: HashRepository,
    private readonly redisProvider: RedisProvider,
  ) {}

  private async importHashesFromLinks() {
    try {
      const links = await this.linksRepository.findAllNotExpired();

      const hashes = links.map((link) => link.hash_link);

      const setUsedFactory = (hash: string) =>
        this.hashRepository.setUsedOrCreateUsed(hash);

      const loadLinksOnRedis = (link: Link) =>
        this.redisProvider.save(`links:${link.hash_link}`, link);

      const promises = [
        ...hashes.map(setUsedFactory),
        ...links.map(loadLinksOnRedis),
      ];

      await Promise.allSettled(promises);
    } catch {}
  }

  @Timeout(1000)
  public async importHashesOnStart() {
    if (!!process.env.IMPORT_HASHES_FROM_LINKS)
      await this.importHashesFromLinks();
  }
}
