import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MaliciousContentCheckProvider } from 'src/shared/providers/MaliciousContentCheckProvider/implementations/malicious-content-check.provider';
import RedisProvider from 'src/shared/providers/RedisProvider/implementations/RedisProvider';
import { URLS_TO_CHECK_MALICIOUS_CONTENT } from '../links.constants';
import { LinkRepository } from '../repositories/implementations/link.repository';

@Injectable()
export class CheckMaliciousLinksFailedTask {
  constructor(
    private readonly redisProvider: RedisProvider,
    private readonly maliciousContentCheck: MaliciousContentCheckProvider,
    private readonly linksRepository: LinkRepository,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async checkMaliciousLinksFailed() {
    const urlsToCheck = await this.redisProvider.lrange(
      URLS_TO_CHECK_MALICIOUS_CONTENT,
      0,
      -1,
    );

    const urlsToCheckUnique = [...new Set(urlsToCheck)];

    try {
      const response = await this.maliciousContentCheck.checkMany(
        urlsToCheckUnique,
      );
      if (!response.hasSomeMalicious) {
        await this.redisProvider.ltrim(
          URLS_TO_CHECK_MALICIOUS_CONTENT,
          urlsToCheck.length,
          -1,
        );
        return;
      }

      await this.linksRepository.setManyMaliciousByOriginalLink(
        response.maliciousUrls,
      );

      const links = await this.linksRepository.findManyByOriginalLink(
        response.maliciousUrls,
      );

      const promises = links.map(async (link) =>
        this.redisProvider.delete(`links:${link.original_link}`),
      );

      await Promise.allSettled(promises);

      await this.redisProvider.ltrim(
        URLS_TO_CHECK_MALICIOUS_CONTENT,
        urlsToCheck.length,
        -1,
      );
    } catch (err) {
      console.log(err);
    }
  }
}
