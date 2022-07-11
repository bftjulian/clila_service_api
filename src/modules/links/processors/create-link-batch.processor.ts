import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CREATE_LINKS_BATCH, LINKS_BATCH_PROCESSOR } from '../links.constants';
import { LinkRepository } from '../repositories/implementations/link.repository';
import { ICreateBatchLinksJob } from './jobs/create-batch-links.job';

@Processor(LINKS_BATCH_PROCESSOR)
export class CreateLinkBatch {
  constructor(private readonly link: LinkRepository) {}

  @Process({
    concurrency: 2,
    name: CREATE_LINKS_BATCH,
  })
  public async feedHashesDatabase(job: Job<ICreateBatchLinksJob>) {
    const { links } = job.data;
    await this.link.createMany(links);

    await new Promise((resolve) =>
      setTimeout(resolve, +process.env.BATCH_LINKS_RATE_EVERY_SECONDS * 1000),
    );
  }

  @OnQueueFailed()
  public onFailed(job: Job<ICreateBatchLinksJob>, err: Error) {
    console.log(err);
  }
}
