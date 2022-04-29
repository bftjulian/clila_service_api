import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LinkRepository } from '../repositories/implementations/link.repository';

@Injectable()
export class InactiveLinkExpiredTask {
  constructor(private readonly linksRepository: LinkRepository) {}

  private readonly logger = new Logger(InactiveLinkExpiredTask.name);

  private async removeLinkExpired() {
    try {
      const today = new Date();
      const priorDate = new Date(new Date().setDate(today.getDate() - 30));
      await this.linksRepository.inactiveAllBeforeDate(priorDate);
      this.logger.debug('Inactivate links expireds');
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  public async expiredLink() {
    await this.removeLinkExpired();
  }
}
