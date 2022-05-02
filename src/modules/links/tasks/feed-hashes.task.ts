import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { JobOptions, Queue } from 'bull';
import {
  FEED_DATABASE_HASHES_COLLECTION,
  HASHES_PROCESSOR,
} from '../links.constants';
import { HashRepository } from '../repositories/implementations/hash.repository';

type JobConf = {
  name?: string | undefined;
  data: any;
  opts?: Omit<JobOptions, 'repeat'> | undefined;
};
@Injectable()
export class FeedHashesTask {
  constructor(
    private readonly hashRepository: HashRepository,
    @InjectQueue(HASHES_PROCESSOR) private readonly hashesQueue: Queue,
  ) {}

  private async generateHashesMissingSixDigits() {
    const jobsOnQueue = await this.hashesQueue.getJobCounts();

    const insertSimultaneous = +process.env.HASH_INSERT_SIMULTANEOUS;

    const freeHashesCount = await this.hashRepository.getFreeHashesCount();
    const percentage = Math.round(
      (freeHashesCount / +process.env.HASH_BASE_COUNT) * 100,
    );

    if (percentage > +process.env.HASHES_MIN_FREE_PERCENTAGE) return;

    const countToTotal = +process.env.HASH_BASE_COUNT - freeHashesCount;
    let countToInsert = Math.ceil(countToTotal / insertSimultaneous);

    if (countToInsert < jobsOnQueue.waiting) return;

    countToInsert = countToInsert - jobsOnQueue.waiting;

    const jobs = Array.from(Array(countToInsert).keys()).map(
      () =>
        ({
          name: FEED_DATABASE_HASHES_COLLECTION,
          data: {},
        } as JobConf),
    );

    await this.hashesQueue.addBulk(jobs);
  }

  @Cron(CronExpression.EVERY_6_HOURS)
  public async generateHashesTask() {
    await this.generateHashesMissingSixDigits();
  }

  @Timeout(500)
  public async generateHashesOnStart() {
    await this.generateHashesMissingSixDigits();
  }
}
