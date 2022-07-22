import { Inject, Injectable } from '@nestjs/common';
import { IUserTokenDto } from '../../../auth/dtos/user-token.dto';
import { DashboardRepository } from '../../repositories/implementations/dashboard.repository';
import { CacheDataRepository } from '../../repositories/implementations/cache-data.repository';
import { IDashboardRepository } from '../../repositories/interfaces/dashboard-repository.interface';
import { ICacheDataRepository } from '../../repositories/interfaces/cache-data-repository.interface';

@Injectable()
export class ReadService {
  constructor(
    @Inject(CacheDataRepository)
    private readonly cacheDataRepository: ICacheDataRepository,

    @Inject(DashboardRepository)
    private readonly dashboardRepository: IDashboardRepository,
  ) {}

  public async readAllDataFromCache(user: IUserTokenDto) {}

  public async readTotalData(user: IUserTokenDto, whichData: string) {
    const userId = user.id;

    const cacheId = `dashboard:total:${whichData}:${userId}`;

    return this.cacheDataRepository.read(cacheId);
  }

  public async readDataGrouped(user: IUserTokenDto, whichData: string) {
    const userId = user.id;

    const idPattern = `dashboard:grouped:${whichData}:${userId}:*`;

    const dataGrouped = await this.cacheDataRepository.readManyByPattern(
      idPattern,
    );

    return dataGrouped;
  }

  public async readTotalClicks(user: IUserTokenDto) {
    const userId = user.id;

    let totalClicks;

    totalClicks = await this.readTotalData(user, 'clicks');

    if (!totalClicks)
      totalClicks = this.dashboardRepository.readTotalClicks(userId);

    return {
      total_clicks: {
        title: 'Total Clicks',
        value: totalClicks,
      },
    };
  }

  public async readClicksGrouped(user: IUserTokenDto) {
    const userId = user.id;

    const clicksGrouped =
      (await this.readDataGrouped(user, 'clicks')) ||
      (await this.dashboardRepository.readDataClicks(userId));

    return { clicks: { title: 'Clicks', value: clicksGrouped } };
  }

  public async readTotalLinks(user: IUserTokenDto) {
    const userId = user.id;

    const totalLinks =
      (await this.readTotalData(user, 'links')) ||
      (await this.dashboardRepository.readTotalLinks(userId));

    return {
      total_links: {
        title: 'Total Links',
        value: totalLinks,
      },
    };
  }

  public async readLinksGrouped(user: IUserTokenDto) {
    const userId = user.id;

    let linksGrouped;
    linksGrouped = await this.readDataGrouped(user, 'links');

    if (linksGrouped === []) {
      linksGrouped = await this.dashboardRepository.readDataLinks(userId);
    }

    return { links: { title: 'Links', value: linksGrouped } };
  }

  public async readTotalGroups(user: IUserTokenDto) {
    const userId = user.id;

    const totalGroups =
      (await this.readTotalData(user, 'groups')) ||
      (await this.dashboardRepository.readTotalGroups(userId));

    return {
      total_groups: {
        title: 'Total Groups',
        value: totalGroups,
      },
    };
  }

  public async readGroupsGrouped(user: IUserTokenDto) {
    const userId = user.id;

    const groupsGrouped =
      (await this.readDataGrouped(user, 'groups')) ||
      (await this.dashboardRepository.readDataGroups(userId));

    return { groups: { title: 'Groups', value: groupsGrouped } };
  }
}
