import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  FEED_DATABASE_LINK_COLLECTION,
  LINK_CLICKED_PROCCESSOR_NAME,
} from 'src/app.constants';
import { GroupRepository } from 'src/modules/links/repositories/implementations/group.repository';
import { LinkRepository } from 'src/modules/links/repositories/implementations/link.repository';
import InfoClicksWebhookProvider from 'src/shared/providers/InfoClicksWebhookProvider/implementations/InfoClicksWebhookProvider';

@Processor(LINK_CLICKED_PROCCESSOR_NAME)
export class FeedClicksInfosDatabase {
  constructor(
    private readonly linksRepository: LinkRepository,
    private readonly groupRepository: GroupRepository,
    private readonly webhookProvider: InfoClicksWebhookProvider,
  ) {}

  @Process({
    concurrency: 10,
    name: FEED_DATABASE_LINK_COLLECTION,
  })
  public async feedClicksInfosDatabase(job: Job) {
    try {
      await this.linksRepository.createLinkInfo({
        create_at: new Date(),
        ip: job.data.ip,
        link: job.data.link,
      });
      const link = await this.linksRepository.setClickLink(job.data.link._id);

      //send webhooks for disparopro, implementation
      await this.webhookProvider.create(link);

      console.log(job.data.link);

      if (!job.data.link.group) return;

      // Increment click on group
      await this.groupRepository.incrementClick(job.data.link.group._id);
      const groupRef = await this.linksRepository.findGroupRefByGroup(
        job.data.link.group,
      );
      await this.linksRepository.setClickLink(groupRef._id);
    } catch (error) {
      console.error(error);
    }
  }
}
