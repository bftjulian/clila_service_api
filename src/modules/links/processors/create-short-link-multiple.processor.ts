import { InjectQueue, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { Job, JobOptions, Queue } from 'bull';
import {
  CREATE_SHORT_LINK_MULTIPLE,
  LINKS_SHORT_MULTIPLE_PROCESSOR,
  VERIFY_MALICIOUS_LINKS,
  VERIFY_MALICIOUS_LINKS_PROCESSOR,
} from '../links.constants';
import { LinkRepository } from '../repositories/implementations/link.repository';
import { ICreateShortLinksMultipleJob } from './jobs/create-short-links-multiple.job';

type JobConf = {
  name?: string | undefined;
  data: any;
  opts?: Omit<JobOptions, 'repeat'> | undefined;
};
@Processor(LINKS_SHORT_MULTIPLE_PROCESSOR)
export class CreateShortLinkMultiple {
  constructor(
    private readonly linkRepository: LinkRepository,
    @InjectQueue(VERIFY_MALICIOUS_LINKS_PROCESSOR)
    private readonly verifyMaliciousLinksQueue: Queue,
    private readonly configService: ConfigService,
  ) {}

  @Process({
    concurrency: 1,
    name: CREATE_SHORT_LINK_MULTIPLE,
  })
  public async shortLinkMultiple(job: Job) {
    await this.linkRepository.createMany(job.data.links);
    const links = job.data.links.map((link) => {
      const l = { link: link.original_link };
      return l;
    });

    const bulkSize = this.configService.get<number>(
      'VERIFY_MALICIOUS_LINKS_RATE',
    );

    const insertRate = Math.ceil(links.length / bulkSize);

    const listToQueue = Array.from(Array(insertRate).keys()).map(() => {
      return {
        name: VERIFY_MALICIOUS_LINKS,
        data: {
          links,
        },
        opts: {
          delay: 1 * 1000,
        },
      } as JobConf;
    });
    await this.verifyMaliciousLinksQueue.addBulk(listToQueue);
  }

  @OnQueueFailed()
  public onFailed(job: Job<ICreateShortLinksMultipleJob>, err: Error) {
    console.log(err.message);
  }
}
