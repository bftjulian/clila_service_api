import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { generateHash } from 'src/utils/generate-hash';
import { HashRepository } from '../repositories/implementations/hash.repository';

@Injectable()
export class FeedHashesTask {
  constructor(private readonly hashesRepository: HashRepository) {}

  private async generateHashesMissingSixDigits() {
    console.log('Generating six digits hashes missing on database');

    const insertRate = +process.env.HASH_INSERT_SIMULTANEOUS;

    const freeHashesCount = await this.hashesRepository.getFreeHashesCount();
    const percentage = Math.round(
      (freeHashesCount / +process.env.HASH_BASE_COUNT) * 100,
    );

    if (percentage > +process.env.HASHES_MIN_FREE_PERCENTAGE) return;

    const countToTotal = +process.env.HASH_BASE_COUNT - freeHashesCount;
    const date = new Date();
    let missingToInsert = countToTotal;

    for (let i = 0; i < Math.ceil(countToTotal / insertRate); i++) {
      const hashCountGenerate = Math.min(insertRate, missingToInsert);

      let hashes = Array.from(Array(hashCountGenerate).keys()).map(() => ({
        hash: generateHash(6),
        hash_length: 6,
        in_use: false,
        permanent: false,
        created_at: date,
        updated_at: date,
      }));

      missingToInsert -= insertRate;

      try {
        await this.hashesRepository.createMany(hashes);
        console.log(`${hashCountGenerate} Hashes inserted on database`);
      } catch {}

      await new Promise((resolve) =>
        setTimeout(resolve, +process.env.HASH_INSERT_EVERY_SECONDS * 1000),
      );
      hashes = undefined;
    }
  }

  @Cron(CronExpression.EVERY_6_HOURS)
  public async generateHashesTask() {
    await this.generateHashesMissingSixDigits();
  }

  @Timeout(5000)
  public async generateHashesOnStart() {
    await this.generateHashesMissingSixDigits();
  }
}
