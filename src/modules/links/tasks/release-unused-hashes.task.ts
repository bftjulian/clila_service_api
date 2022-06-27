import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HashRepository } from '../repositories/implementations/hash.repository';
import { LinkRepository } from '../repositories/implementations/link.repository';

@Injectable()
export class ReleaseUnusedHashesTask {
  constructor(
    private readonly hashRepository: HashRepository,
    private readonly linksRepository: LinkRepository,
  ) {}
  private readonly logger = new Logger(ReleaseUnusedHashesTask.name);

  @Cron('0 03 1 */3 *')
  public async releaseUnusedHashes() {
    const hashesInUsed = await this.hashRepository.getAllInUse();
    const verifyLinks = hashesInUsed.map(async (hash) => {
      const link = await this.linksRepository.findByHash(hash.hash);
      if (!link || (!!link && link.active === false)) {
        await this.hashRepository.setUnused(hash.hash);
      }
    });
    await Promise.allSettled(verifyLinks);
    this.logger.debug('Release unused Hashes');
  }
}
