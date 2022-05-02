import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { Queue } from 'bull';
import {
  IMPORT_HASHES_FROM_LINKS_PROCESSOR,
  IMPORT_LINKS_PROCESS,
} from '../links.constants';
import { HashRepository } from '../repositories/implementations/hash.repository';
import { LinkRepository } from '../repositories/implementations/link.repository';

@Injectable()
export class ImportHashFromLinksTask {
  constructor(
    private readonly linksRepository: LinkRepository,
    private readonly hashRepository: HashRepository,
    @InjectQueue(IMPORT_HASHES_FROM_LINKS_PROCESSOR)
    private readonly importHashesQueue: Queue,
  ) {}

  private async importHashesFromLinks() {
    try {
      // await this.importHashesQueue.clean(10000, 'completed');

      const limit = +process.env.IMPORT_HASH_RATE;
      const linksCount = await this.linksRepository.countAllNotExpired();
      let pages = Math.ceil(linksCount / limit);
      const queueInfo = await this.importHashesQueue.getJobCounts();
      const inQueue =
        queueInfo.completed + queueInfo.active + queueInfo.waiting;

      if (pages <= inQueue) return;

      pages = pages - inQueue;

      let initialPage = inQueue + 1;

      const jobs = Array.from(Array(pages)).map(() => {
        const atualPage = initialPage;
        initialPage++;
        return {
          name: IMPORT_LINKS_PROCESS,
          data: {
            page: atualPage,
            limit,
          },
        };
      });

      await this.importHashesQueue.addBulk(jobs);
    } catch {}
  }

  @Timeout(1000)
  public async importHashesOnStart() {
    if (!!process.env.IMPORT_HASHES_FROM_LINKS)
      await this.importHashesFromLinks();
  }
}
