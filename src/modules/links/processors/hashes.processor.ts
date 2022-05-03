import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { generateHash } from 'src/utils/generate-hash';
import {
  FEED_DATABASE_HASHES_COLLECTION,
  HASHES_PROCESSOR,
} from '../links.constants';
import { HashRepository } from '../repositories/implementations/hash.repository';

@Processor(HASHES_PROCESSOR)
export class FeedHashesDatabase {
  constructor(private readonly hashRepository: HashRepository) {}

  @Process({
    concurrency: 1,
    name: FEED_DATABASE_HASHES_COLLECTION,
  })
  public async feedHashesDatabase(job: Job) {
    const simultaneous = +process.env.HASH_INSERT_SIMULTANEOUS;

    let hashes = Array.from(Array(simultaneous).keys()).map(() => ({
      hash: generateHash(6),
      hash_length: 6,
      in_use: false,
      permanent: false,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    try {
      await this.hashRepository.createMany(hashes);
    } catch {}

    hashes = undefined;

    job.progress(50);

    await new Promise((resolve) =>
      setTimeout(resolve, +process.env.HASH_INSERT_EVERY_SECONDS * 1000),
    );
  }
}
