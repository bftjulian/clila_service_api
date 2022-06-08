import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MaliciousContentCheckProvider } from 'src/shared/providers/MaliciousContentCheckProvider/implementations/malicious-content-check.provider';
import RedisProvider from 'src/shared/providers/RedisProvider/implementations/RedisProvider';
import { MALICIOUS_URLS } from '../links.constants';
import { LinkRepository } from '../repositories/implementations/link.repository';

@Injectable()
export class SearchForMaliciousLinksOnDatabase {
  constructor(
    private readonly linksRepository: LinkRepository,
    private readonly redisProvider: RedisProvider,
    private readonly maliciousContentCheck: MaliciousContentCheckProvider,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  public async searchForMaliciousLinksOnDatabase() {
    const links =
      await this.linksRepository.findAllNotMaliciousAndNotExpiredWithoutGroupLinks();

    const urls = links.map((link) => link.original_link);

    const linksWithMaliciousContent =
      await this.maliciousContentCheck.checkMany(urls);

    if (!linksWithMaliciousContent.hasSomeMalicious) return;

    await this.linksRepository.setManyMaliciousByOriginalLink(
      linksWithMaliciousContent.maliciousUrls,
    );

    const maliciousLinks = links.filter((link) =>
      linksWithMaliciousContent.maliciousUrls.includes(link.original_link),
    );

    console.log(maliciousLinks);

    const promises = [
      ...maliciousLinks.map(async (link) =>
        this.redisProvider.delete(`links:${link.hash_link}`),
      ),
      ...linksWithMaliciousContent.maliciousUrls.map((url) =>
        this.redisProvider.zadd(MALICIOUS_URLS, Date.now(), url),
      ),
    ];

    await Promise.allSettled(promises);
  }
}
