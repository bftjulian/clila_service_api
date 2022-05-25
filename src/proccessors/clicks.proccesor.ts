import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  FEED_DATABASE_LINK_COLLECTION,
  LINK_CLICKED_PROCCESSOR_NAME,
} from 'src/app.constants';
import { GroupRepository } from 'src/modules/links/repositories/implementations/group.repository';
import { LinkRepository } from 'src/modules/links/repositories/implementations/link.repository';
import { DisparoproInfoClicksWebhookProvider } from 'src/shared/providers/InfoClicksWebhookProvider/implementations/disparopro-info-clicks-webhook.provider';

@Processor(LINK_CLICKED_PROCCESSOR_NAME)
export class FeedClicksInfosDatabase {
  constructor(
    private readonly linksRepository: LinkRepository,
    private readonly groupRepository: GroupRepository,
    private readonly webhookProvider: DisparoproInfoClicksWebhookProvider,
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

      if (!job.data.link.group) return;

      //send webhooks for disparopro, implementation
      await this.webhookProvider.sendClickInfo(link);

      // Increment click on group
      if (job.data.link.group._id !== undefined) {
        await this.groupRepository.incrementClick(job.data.link.group._id);
      } else {
        await this.groupRepository.incrementClick(job.data.link.group);
      }
      const groupRef = await this.linksRepository.findGroupRefByGroup(
        job.data.link.group,
      );
      await this.linksRepository.setClickLink(groupRef._id);
    } catch (error) {
      console.error(error);
    }
  }
}
