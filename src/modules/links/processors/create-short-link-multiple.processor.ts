import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  CREATE_SHORT_LINK_MULTIPLE,
  LINKS_SHORT_MULTIPLE_PROCESSOR,
} from '../links.constants';
import { LinkRepository } from '../repositories/implementations/link.repository';
import { ICreateShortLinksMultipleJob } from './jobs/create-short-links-multiple.job';

@Processor(LINKS_SHORT_MULTIPLE_PROCESSOR)
export class CreateShortLinkMultiple {
  constructor(private readonly linkRepository: LinkRepository) {}

  @Process({
    concurrency: 1,
    name: CREATE_SHORT_LINK_MULTIPLE,
  })
  public async shortLinkMultiple(job: Job<ICreateShortLinksMultipleJob[]>) {
    await this.linkRepository.createMany(job.data);

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
