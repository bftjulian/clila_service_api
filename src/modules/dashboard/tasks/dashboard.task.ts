import * as dateFns from 'date-fns';
import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CacheDataRepository } from '../repositories/implementations/cache-data.repository';
import { ICacheDataRepository } from '../repositories/interfaces/cache-data-repository.interface';

@Injectable()
export class DashboardTasker {
  constructor(
    @Inject(CacheDataRepository)
    private readonly cacheDataRepository: ICacheDataRepository,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  public async deleteUserCache() {
    const CACHE_DURATION = 5;

    const now = new Date();

    const cacheIdsPattern = 'dashboard:user:*:logout';

    const logoutInfo = await this.cacheDataRepository.readManyByPattern(
      cacheIdsPattern,
    );

    await Promise.all(
      logoutInfo.map((userDisconnected) => {
        if (
          dateFns.intervalToDuration({
            start: dateFns.parseISO(userDisconnected.date),
            end: now,
          }).minutes >= CACHE_DURATION
        ) {
          const userId = userDisconnected.user;

          const cacheId = `dashboard:user:${userId}:*`;

          return this.cacheDataRepository.deleteManyByPattern(cacheId);
        }
      }),
    );
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  public async deleteTokens() {
    const TOKEN_DURATION = 5;

    const now = new Date();

    const cacheIdsPattern = 'dashboard:token:*';

    const tokens = await this.cacheDataRepository.readManyByPattern(
      cacheIdsPattern,
    );

    await Promise.all(
      tokens.map((token) => {
        if (
          dateFns.intervalToDuration({
            start: dateFns.parseISO(token.date),
            end: now,
          }).minutes >= TOKEN_DURATION
        ) {
          return this.cacheDataRepository.delete(token.token);
        }
      }),
    );
  }
}
