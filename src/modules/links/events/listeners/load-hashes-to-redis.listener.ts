import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RELOAD_LINKS_ON_REDIS_EVENT } from '../../links.constants';
import { LoadHashesOnRedisService } from '../../service/load-hashes-on-redis/load-hashes-on-redis.service';

@Injectable()
export class LoadHashesOnRedisListener {
  constructor(
    private readonly loadHashesOnRedisService: LoadHashesOnRedisService,
  ) {}

  @OnEvent(RELOAD_LINKS_ON_REDIS_EVENT, { async: true })
  public async handleReloadLinksOnRedisEvent(): Promise<void> {
    await this.loadHashesOnRedisService.loadSixDigitsHashes();
  }
}
