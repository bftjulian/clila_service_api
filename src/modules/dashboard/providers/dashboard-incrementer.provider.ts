import { Server } from 'socket.io';
import { Inject, Injectable } from '@nestjs/common';
import { Link } from '../../links/models/link.model';
import { Group } from '../../links/models/groups.model';
import { LoadService } from '../services/load/load.service';
import { ReadService } from '../services/read/read.service';
import { LinkInfos } from '../../links/models/link-infos.model';
import { ILinkRepository } from '../../links/repositories/link-repository.interface';
import { LinkRepository } from '../../links/repositories/implementations/link.repository';
import { DashboardRepository } from '../repositories/implementations/dashboard.repository';
import { CacheDataRepository } from '../repositories/implementations/cache-data.repository';
import { IDashboardRepository } from '../repositories/interfaces/dashboard-repository.interface';
import { ICacheDataRepository } from '../repositories/interfaces/cache-data-repository.interface';
import { IUserTokenDto } from 'src/modules/auth/dtos/user-token.dto';
import { EmitService } from '../services/emit/emit.service';

@Injectable()
export class DashboardIncrementerProvider {
  constructor(
    @Inject(LinkRepository)
    private readonly linkRepository: ILinkRepository,

    @Inject(CacheDataRepository)
    private readonly cacheDataRepository: ICacheDataRepository,

    @Inject(DashboardRepository)
    private readonly dashboardRepository: IDashboardRepository,

    private readonly loadService: LoadService,

    private readonly readService: ReadService,

    private readonly emitService: EmitService,
  ) {}

  public async linkClicked(linkInfo: LinkInfos) {
    const clickEvent = await this.dashboardRepository.readClickEvent(linkInfo);

    const userId = clickEvent[0].user_id;

    const userSocketInfo = await this.cacheDataRepository.read(
      `dashboard:user:${userId}:info`,
    );

    const clicksGrouped = await Promise.all(
      clickEvent.map((click) => {
        const cacheId = `dashboard:grouped:clicks:${click.user_id}:${click.link_id}:${click.date}`;

        return this.cacheDataRepository.create(cacheId, click);
      }),
    );

    await this.emitService.emitEvent(userSocketInfo, clicksGrouped);

    const totalValueCacheId = `dashboard:total:clicks:${userId}`;

    const totalClicks = await this.cacheDataRepository.incrementValue(
      totalValueCacheId,
    );

    await this.emitService.emitEvent(userSocketInfo, totalClicks);
  }

  public async manyLinksCreated(linksInformation) {
    const linkEvent = await this.dashboardRepository.readManyLinksCreatedEvent(
      linksInformation,
    );

    await Promise.all(
      linkEvent.map((link) => {
        let group;

        if (!link.group) {
          group = '-';
        } else {
          group = link.group;
        }

        const cacheId = `dashboard:grouped:links:${link.user}:${group}:${link.date}`;

        return this.cacheDataRepository.create(cacheId, link);
      }),
    );

    const totalValueCacheId = `dashboard:total:links:${linksInformation.user}`;

    await this.cacheDataRepository.incrementValue(
      totalValueCacheId,
      linksInformation.length,
    );
  }

  public async groupCreated(group: Group) {
    const groupEvent = await this.dashboardRepository.readGroupCreatedEvent(
      group,
    );

    await Promise.all(
      groupEvent.map((document) => {
        const cacheId = `dashboard:grouped:groups:${document.user_id}:${document.date}`;

        return this.cacheDataRepository.create(cacheId, document);
      }),
    );

    const totalValueCacheId = `dashboard:total:groups:${group.user}`;

    await this.cacheDataRepository.incrementValue(totalValueCacheId);
  }
}
