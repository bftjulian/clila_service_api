import { Job } from 'bull';
import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { ICreateBatchLinksJob } from './jobs/create-batch-links.job';
import { CREATE_LINKS_BATCH, LINKS_BATCH_PROCESSOR } from '../links.constants';
import { LinkRepository } from '../repositories/implementations/link.repository';
import { DashboardIncrementerProvider } from 'src/modules/dashboard/providers/dashboard-incrementer.provider';

@Processor(LINKS_BATCH_PROCESSOR)
export class CreateLinkBatch {
  constructor(
    private readonly link: LinkRepository,
    private readonly dashboardIncrementerProvider: DashboardIncrementerProvider,
  ) {}

  @Process({
    concurrency: 2,
    name: CREATE_LINKS_BATCH,
  })
  public async feedHashesDatabase(job: Job<ICreateBatchLinksJob>) {
    const { links } = job.data;

    const now = new Date();

    const createLinks = await this.link.createMany(links);

    const user = createLinks[0].user;

    await this.dashboardIncrementerProvider.manyLinksCreated({
      user: user,
      date: now,
      length: createLinks.length,
    });

    await new Promise((resolve) =>
      setTimeout(resolve, +process.env.BATCH_LINKS_RATE_EVERY_SECONDS * 1000),
    );
  }

  @OnQueueFailed()
  public onFailed(job: Job<ICreateBatchLinksJob>, err: Error) {
    console.log(err);
  }
}
