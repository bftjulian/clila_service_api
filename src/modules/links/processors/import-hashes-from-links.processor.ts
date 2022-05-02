import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import RedisProvider from 'src/shared/providers/RedisProvider/implementations/RedisProvider';
import { generateHash } from 'src/utils/generate-hash';
import {
  FEED_DATABASE_HASHES_COLLECTION,
  HASHES_PROCESSOR,
  IMPORT_HASHES_FROM_LINKS_PROCESSOR,
  IMPORT_LINKS_PROCESS,
} from '../links.constants';
import { Link } from '../models/link.model';
import { HashRepository } from '../repositories/implementations/hash.repository';
import { LinkRepository } from '../repositories/implementations/link.repository';
import { IImportLinksJob } from './jobs/import-links.job';

@Processor(IMPORT_HASHES_FROM_LINKS_PROCESSOR)
export class ImportHashesFromLinksProcessor {
  constructor(
    private readonly hashRepository: HashRepository,
    private readonly linksRepository: LinkRepository,
    private readonly redisProvider: RedisProvider,
  ) {}

  @Process({
    concurrency: 1,
    name: IMPORT_LINKS_PROCESS,
  })
  public async importLinks(job: Job<IImportLinksJob>) {
    const { page, limit } = job.data;

    try {
      const links = await this.linksRepository.findAllNotExpired(page, limit);
      const hashes = links.map((link) => link.hash_link);

      const setUsedFactory = (hash: string) =>
        this.hashRepository.setUsedOrCreateUsed(hash);

      const loadLinksOnRedis = (link: Link) =>
        this.redisProvider.save(`links:${link.hash_link}`, link);

      const promises = [
        ...hashes.map(setUsedFactory),
        ...links.map(loadLinksOnRedis),
      ];
      await Promise.allSettled(promises);
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
