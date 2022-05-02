import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LINK_CLICKED_EVENT_NAME } from 'src/app.constants';
import { LinkRepository } from 'src/modules/links/repositories/implementations/link.repository';
import { LinkClickedEvent } from '../link-clicked.event';

@Injectable()
export class LinkClickedListener {
  constructor(private readonly linksRepository: LinkRepository) {}

  @OnEvent(LINK_CLICKED_EVENT_NAME, { async: true })
  public async handleLinkClickedEvent(event: LinkClickedEvent): Promise<void> {
    try {
      await this.linksRepository.createLinkInfo({
        create_at: new Date(),
        ip: event.ip,
        link: event.link,
      });
      await this.linksRepository.setClickLink(event.link._id);
    } catch {}
  }
}
