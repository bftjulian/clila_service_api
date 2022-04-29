import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import RedisProvider from 'src/shared/providers/RedisProvider/implementations/RedisProvider';
import { FREE_SIX_DIGITS_HASHES_REDIS_KEY } from '../links.constants';
import { HashRepository } from '../repositories/implementations/hash.repository';

@Injectable()
export class LoadHashesOnRedisTask {
  constructor(
    private readonly redisProvider: RedisProvider,
    private readonly hashRepository: HashRepository,
  ) {}

  private async loadSixDigitsHashes() {
    console.log('Loading six digits hashes');
    const freeHashesCount = await this.redisProvider.llen(
      FREE_SIX_DIGITS_HASHES_REDIS_KEY,
    );

    console.log(freeHashesCount);
    console.log(process.env.HASH_BASE_COUNT_ON_REDIS);

    if (freeHashesCount === +process.env.HASH_BASE_COUNT_ON_REDIS) return;
    const diff = +process.env.HASH_BASE_COUNT_ON_REDIS - freeHashesCount;

    const databaseHashes = await this.hashRepository.getFreeHashes(diff, 6);

    console.log(databaseHashes);

    if (databaseHashes.length === 0) return;

    const hashes = databaseHashes.map((hash) => hash.hash);

    await this.redisProvider.lpush(FREE_SIX_DIGITS_HASHES_REDIS_KEY, hashes);

    console.log('Hashes loaded');
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  public async loadHashesOnRedis() {
    await this.loadSixDigitsHashes();
  }

  @Timeout(15000)
  public async loadHashesOnStart() {
    await this.loadSixDigitsHashes();
  }
}
