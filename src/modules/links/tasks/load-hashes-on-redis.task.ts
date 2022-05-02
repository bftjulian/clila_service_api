import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import RedisProvider from 'src/shared/providers/RedisProvider/implementations/RedisProvider';
import { FREE_SIX_DIGITS_HASHES_REDIS_KEY } from '../links.constants';
import { HashRepository } from '../repositories/implementations/hash.repository';
import { LoadHashesOnRedisService } from '../service/load-hashes-on-redis/load-hashes-on-redis.service';

@Injectable()
export class LoadHashesOnRedisTask {
  constructor(
    private readonly loadHashesOnRedisService: LoadHashesOnRedisService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  public async loadHashesOnRedis() {
    await this.loadHashesOnRedisService.loadSixDigitsHashes();
  }

  @Timeout(1000)
  public async loadHashesOnStart() {
    await this.loadHashesOnRedisService.loadSixDigitsHashes();
  }

  @Timeout(15000)
  public async loadHashesOnStartDelay() {
    await this.loadHashesOnRedisService.loadSixDigitsHashes();
  }
}
