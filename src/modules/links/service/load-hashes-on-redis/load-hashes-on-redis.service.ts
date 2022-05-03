import { Injectable } from '@nestjs/common';
import RedisProvider from 'src/shared/providers/RedisProvider/implementations/RedisProvider';
import { FREE_SIX_DIGITS_HASHES_REDIS_KEY } from '../../links.constants';
import { HashRepository } from '../../repositories/implementations/hash.repository';

@Injectable()
export class LoadHashesOnRedisService {
  constructor(
    private readonly redisProvider: RedisProvider,
    private readonly hashRepository: HashRepository,
  ) {}

  public async loadSixDigitsHashes() {
    const freeHashesCount = await this.redisProvider.llen(
      FREE_SIX_DIGITS_HASHES_REDIS_KEY,
    );

    if (freeHashesCount === +process.env.HASH_BASE_COUNT_ON_REDIS) return;
    const diff = +process.env.HASH_BASE_COUNT_ON_REDIS - freeHashesCount;

    const databaseHashes = await this.hashRepository.getFreeHashes(diff, 6);

    if (databaseHashes.length === 0) return;

    const hashes = databaseHashes.map((hash) => hash.hash);

    const originalHashes = [...hashes];

    const threePartIndex = Math.ceil(hashes.length / 3);

    const thirdPart = hashes.splice(-threePartIndex);
    const secondPart = hashes.splice(-threePartIndex);
    const firstPart = hashes;

    await this.redisProvider.lpush(FREE_SIX_DIGITS_HASHES_REDIS_KEY, firstPart);
    await this.redisProvider.lpush(
      FREE_SIX_DIGITS_HASHES_REDIS_KEY,
      secondPart,
    );
    await this.redisProvider.lpush(FREE_SIX_DIGITS_HASHES_REDIS_KEY, thirdPart);
    await this.hashRepository.setManyUsed(originalHashes);
  }
}
