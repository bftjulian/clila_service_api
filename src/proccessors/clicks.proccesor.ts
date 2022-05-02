import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import {
  FEED_DATABASE_LINK_COLLECTION,
  LINK_CLICKED_PROCCESSOR_NAME,
} from 'src/app.constants';
import { LinkRepository } from 'src/modules/links/repositories/implementations/link.repository';
import InfoClicksWebhookProvider from 'src/shared/providers/InfoClicksWebhookProvider/implementations/InfoClicksWebhookProvider';

@Processor(LINK_CLICKED_PROCCESSOR_NAME)
export class FeedClicksInfosDatabase {
  constructor(
    private readonly linksRepository: LinkRepository,
    private readonly clicksInfoRepository: InfoClicksWebhookProvider,
  ) {}

  @Process({
    concurrency: 10,
    name: FEED_DATABASE_LINK_COLLECTION,
  })
  public async feedClicksInfosDatabase(job: Job) {
    try {
      //send webhooks for disparopro, implementation
      await this.clicksInfoRepository.create(job.data.link);

      await this.linksRepository.createLinkInfo({
        create_at: new Date(),
        ip: job.data.ip,
        link: job.data.link,
      });
      await this.linksRepository.setClickLink(job.data.link._id);
    } catch (error) {
      console.error(error.message);
    }
  }
}
