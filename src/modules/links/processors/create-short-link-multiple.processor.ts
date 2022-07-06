import { InjectQueue, OnQueueFailed, Process, Processor } from '@nestjs/bull';
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
  ) {}

  @Process({
    concurrency: 1,
    name: CREATE_SHORT_LINK_MULTIPLE,
  })
  public async shortLinkMultiple(job: Job<ICreateShortLinksMultipleJob>) {
    console.log(VERIFY_MALICIOUS_LINKS);
    await this.linkRepository.createMany([job.data]);

    await this.verifyMaliciousLinksQueue.addBulk([
      {
        name: VERIFY_MALICIOUS_LINKS,
        data: {
          links: [job.data.original_link],
        },
        opts: {
          delay: 10 * 1000,
        },
      } as JobConf,
    ]);

    await new Promise((resolve) =>
      setTimeout(
        resolve,
        +process.env.SHORT_MULTIPLE_LINKS_RATE_EVERY_SECONDS * 1000,
      ),
    );
  }

  @OnQueueFailed()
  public onFailed(job: Job<ICreateShortLinksMultipleJob>, err: Error) {
    console.log(err.message);
  }
}
