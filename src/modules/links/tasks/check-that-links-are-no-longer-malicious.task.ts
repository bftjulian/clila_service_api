import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MaliciousContentCheckProvider } from 'src/shared/providers/MaliciousContentCheckProvider/implementations/malicious-content-check.provider';
import RedisProvider from 'src/shared/providers/RedisProvider/implementations/RedisProvider';
import { MALICIOUS_URLS } from '../links.constants';
import { LinkRepository } from '../repositories/implementations/link.repository';

@Injectable()
export class CheckThatLinksAreNoLongerMalicious {
  constructor(
    private readonly redisProvider: RedisProvider,
    private readonly maliciousContentCheck: MaliciousContentCheckProvider,
    private readonly linksRepository: LinkRepository,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  public async CheckThatLinksAreNoLongerMalicious() {
    const links = await this.linksRepository.findAllMaliciousAndNotExpired();

    const urls = links.map((link) => link.original_link);

    const uniqueUrls = [...new Set(urls)];

    const maliciousUrlsResults = await this.maliciousContentCheck.checkMany(
      urls,
    );

    if (maliciousUrlsResults.maliciousUrls.length === uniqueUrls.length) return;

    const notMaliciousUrls = links
      .filter(
        (link) =>
          !maliciousUrlsResults.maliciousUrls.includes(link.original_link),
      )
      .map((link) => link.original_link);

    await this.linksRepository.unsetManyMaliciousByOriginalLink(
      notMaliciousUrls,
    );

    const promises = [
      ...notMaliciousUrls.map(async (url) =>
        this.redisProvider.zrem(MALICIOUS_URLS, url),
      ),
      ...maliciousUrlsResults.maliciousUrls.map((url) =>
        this.redisProvider.zadd(MALICIOUS_URLS, Date.now(), url),
      ),
    ];

    await Promise.allSettled(promises);
  }
}
