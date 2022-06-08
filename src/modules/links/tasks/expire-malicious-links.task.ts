import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';
import { Cron, CronExpression } from '@nestjs/schedule';
import RedisProvider from 'src/shared/providers/RedisProvider/implementations/RedisProvider';
import { MALICIOUS_URLS } from '../links.constants';

@Injectable()
export class ExpireMaliciousLinksTask {
  constructor(private readonly redisProvider: RedisProvider) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async expireMaliciousLinks() {
    const yesterday = subDays(new Date(), 1);
    await this.redisProvider.zremrangebyscore(
      MALICIOUS_URLS,
      0,
      yesterday.getTime(),
    );
  }
}
