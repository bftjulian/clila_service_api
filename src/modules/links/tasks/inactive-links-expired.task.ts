import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import RedisProvider from 'src/shared/providers/RedisProvider/implementations/RedisProvider';
import { LinkRepository } from '../repositories/implementations/link.repository';

@Injectable()
export class InactiveLinkExpiredTask {
  constructor(
    private readonly linksRepository: LinkRepository,
    private readonly redisProvider: RedisProvider,
  ) {}

  private readonly logger = new Logger(InactiveLinkExpiredTask.name);

  private async expireLinksLastMonth() {
    try {
      const today = new Date();
      const priorDate = new Date(new Date().setDate(today.getDate() - 30));
      const hashes = await this.linksRepository.inactiveAllBeforeDate(
        priorDate,
      );
      const promises = hashes.map((hash) =>
        this.redisProvider.delete(`links:${hash}`),
      );
      await Promise.allSettled(promises);
      this.logger.debug('Inactivate links expireds');
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  public async expiredLink() {
    await this.expireLinksLastMonth();
  }
}
