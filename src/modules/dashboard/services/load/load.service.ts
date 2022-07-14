import { Inject, Injectable } from '@nestjs/common';
import { IUserTokenDto } from '../../../auth/dtos/user-token.dto';
import { DashboardRepository } from '../../repositories/implementations/dashboard.repository';
import { CacheDataRepository } from '../../repositories/implementations/cache-data.repository';
import { ICacheDataRepository } from '../../repositories/interfaces/cache-data-repository.interface';
import { IDashboardRepository } from '../../repositories/interfaces/dashboard-repository.interface';

@Injectable()
export class LoadService {
  constructor(
    @Inject(DashboardRepository)
    private readonly dashboardRepository: IDashboardRepository,

    @Inject(CacheDataRepository)
    private readonly cacheDataRepository: ICacheDataRepository,
  ) {}

  public async loadTotalValuesToCache(user: IUserTokenDto) {
    const userId = user.id;

    const readTotalClicks = await this.dashboardRepository.readTotalClicks(
      userId,
    );
    const cacheTotalClicksId = `dashboard:clicks:${userId}:total`;
    await this.cacheDataRepository.create(cacheTotalClicksId, readTotalClicks);

    const readTotalLinks = await this.dashboardRepository.readTotalLinks(
      userId,
    );
    const cacheTotalLinksId = `dashboard:links:${userId}:total`;
    await this.cacheDataRepository.create(cacheTotalLinksId, readTotalLinks);

    const readTotalGroups = await this.dashboardRepository.readTotalGroups(
      userId,
    );
    const cacheTotalGroupsId = `dashboard:groups:${userId}:total`;
    await this.cacheDataRepository.create(cacheTotalGroupsId, readTotalGroups);
  }

  public async loadTotalValuesPerPeriodToCache(user: IUserTokenDto) {
    const userId = user.id;

    const readTotalClicksPerPeriod =
      await this.dashboardRepository.readTotalClicksPerPeriod(userId);
    readTotalClicksPerPeriod.map(async (click) => {
      const cacheId = `dashboard:clicks:${userId}:${click.date}`;
      await this.cacheDataRepository.create(cacheId, click);
    });

    const readTotalLinksPerPeriod =
      await this.dashboardRepository.readTotalLinksPerPeriod(userId);
    readTotalLinksPerPeriod.map(async (link) => {
      const cacheId = `dashboard:links:${userId}:${link.date}`;
      await this.cacheDataRepository.create(cacheId, link);
    });

    const readTotalGroupsPerPeriod =
      await this.dashboardRepository.readTotalGroupsPerPeriod(userId);
    readTotalGroupsPerPeriod.map(async (group) => {
      const cacheId = `dashboard:groups:${userId}:${group.date}`;

      await this.cacheDataRepository.create(cacheId, group);
    });
  }

  public async loadAllDataToCache(user: IUserTokenDto) {
    await this.loadTotalValuesToCache(user);

    await this.loadClicksToCache(user);

    await this.loadLinksToCache(user);

    await this.loadGroupsToCache(user);
  }

  public async loadClicksToCache(user: IUserTokenDto) {
    const userId = user.id;

    const clicksData = await this.dashboardRepository.readDataClicks(userId);

    clicksData.map(async (document) => {
      const cacheId = `dashboard:clicks:${userId}:${document.link_id}:${document.date}`;

      await this.cacheDataRepository.create(cacheId, document);
    });

    return clicksData;
  }

  public async loadLinksToCache(user: IUserTokenDto) {
    const userId = user.id;

    const linksData = await this.dashboardRepository.readDataLinks(userId);

    linksData.map(async (document) => {
      let group;

      if (!document.group) {
        group = '-';
      } else {
        group = document.group;
      }

      const cacheId = `dashboard:links:${userId}:${group}:${document.date}`;

      await this.cacheDataRepository.create(cacheId, document);
    });

    return linksData;
  }

  public async loadGroupsToCache(user: IUserTokenDto) {
    const userId = user.id;

    const groupsData = await this.dashboardRepository.readDataGroups(userId);

    groupsData.map(async (document) => {
      const cacheId = `dashboard:groups:${userId}:${document.date}`;

      await this.cacheDataRepository.create(cacheId, document);
    });

    return groupsData;
  }
}
