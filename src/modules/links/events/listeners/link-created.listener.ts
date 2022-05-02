import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import RedisProvider from 'src/shared/providers/RedisProvider/implementations/RedisProvider';
import {
  LINK_CREATED_EVENT_NAME,
  USED_HASHES_TO_UPDATE_REDIS_KEY,
} from '../../links.constants';
import { HashRepository } from '../../repositories/implementations/hash.repository';
import { LinkCreatedEvent } from '../link-created.event';

@Injectable()
export class LinkCreatedListener {
  constructor(
    private readonly hashRepository: HashRepository,
    private readonly redisProvider: RedisProvider,
  ) {}

  @OnEvent(LINK_CREATED_EVENT_NAME, { async: true })
  public async handleLinkCreatedEvent(event: LinkCreatedEvent): Promise<void> {
    if (event.surname) {
      try {
        await this.hashRepository.create({
          hash: event.surname,
          in_use: true,
          permanent: false,
          hash_length: event.surname.length,
          created_at: new Date(),
          updated_at: new Date(),
        });
      } catch {}
    }

    const usedHashes = await this.redisProvider.popAll(
      USED_HASHES_TO_UPDATE_REDIS_KEY,
    );

    if (usedHashes.length === 0) return;

    try {
      await this.hashRepository.setManyUsed(usedHashes);
    } catch {}
  }
}
