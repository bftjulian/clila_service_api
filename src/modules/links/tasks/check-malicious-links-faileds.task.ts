import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MaliciousContentCheckProvider } from 'src/shared/providers/MaliciousContentCheckProvider/implementations/malicious-content-check.provider';
import RedisProvider from 'src/shared/providers/RedisProvider/implementations/RedisProvider';
import { URLS_TO_CHECK_MALICIOUS_CONTENT } from '../links.constants';
import { HashRepository } from '../repositories/implementations/hash.repository';
import { LinkRepository } from '../repositories/implementations/link.repository';

@Injectable()
export class CheckMaliciousLinksFailedTask {
  constructor(
    private readonly redisProvider: RedisProvider,
    private readonly maliciousContentCheck: MaliciousContentCheckProvider,
    private readonly linksRepository: LinkRepository,
    private readonly hashRepository: HashRepository,
  ) {}
  private readonly logger = new Logger(CheckMaliciousLinksFailedTask.name);

  @Cron(CronExpression.EVERY_30_MINUTES)
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

      const hashes = links.map((link) => link.hash_link);
      await this.linksRepository.expireAllByHash(hashes);
      await this.hashRepository.setAllUnusedByHash(hashes);

      const promises = links.map(async (link) =>
        this.redisProvider.delete(`links:${link.hash_link}`),
      );

      await Promise.allSettled(promises);

      await this.redisProvider.ltrim(
        URLS_TO_CHECK_MALICIOUS_CONTENT,
        urlsToCheck.length,
        -1,
      );
      this.logger.debug('Checked for malicious links failed by REDIS');
    } catch (err) {
      this.logger.error(err.message);
    }
  }
}
