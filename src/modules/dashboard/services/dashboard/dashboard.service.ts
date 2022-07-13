import { I18nService } from 'nestjs-i18n';
import { Result } from '../../../../shared/models/result';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IUserTokenDto } from '../../../../modules/auth/dtos/user-token.dto';
import { DashboardRepository } from '../../repositories/implementations/dashboard.repository';
import { CacheDataRepository } from '../../repositories/implementations/cache-data.repository';
import { ILinkRepository } from '../../../../modules/links/repositories/link-repository.interface';
import { IUserRepository } from '../../../../modules/users/repositories/user-repository.interface';
import { IDashboardRepository } from '../../repositories/interfaces/dashboard-repository.interface';
import { ICacheDataRepository } from '../../repositories/interfaces/cache-data-repository.interface';
import { UserRepository } from '../../../../modules/users/repositories/implementation/user.repository';
import { LinkRepository } from '../../../../modules/links/repositories/implementations/link.repository';

@Injectable()
export class DashboardService {
  constructor(
    @Inject(LinkRepository)
    private readonly linksRepository: ILinkRepository,

    @Inject(UserRepository)
    private readonly usersRepository: IUserRepository,

    @Inject(DashboardRepository)
    private readonly dashboardRepository: IDashboardRepository,

    @Inject(CacheDataRepository)
    private readonly cacheDataRepository: ICacheDataRepository,
  ) {}

  public async handleDisconnect(user: IUserTokenDto) {
    const userId = user.id;

    const now = new Date();

    const cacheId = `dashboard:${userId}:logout`;

    const lastLogout = {
      userId: userId,
      date: now.toISOString(),
    };

    await this.cacheDataRepository.create(cacheId, lastLogout);
  }

  public async handleConnection(user: IUserTokenDto) {
    const userId = user.id;

    const cacheId = `dashboard:${userId}:login`;

    const isCached = await this.cacheDataRepository.read(cacheId);

    if (isCached && isCached.userId === userId && isCached.login === true)
      return;

    await this.loadAllDataToCache(user);

    const now = new Date();

    const lastConnection = {
      login: true,
      userId: userId,
      date: now.toISOString(),
    };

    await this.cacheDataRepository.create(cacheId, lastConnection);
  }

  public async readAllDataFromCache(user: IUserTokenDto) {
    const userId = user.id;

    const idPattern = `dashboard:*:${userId}:*`;

    const dataCached = await this.cacheDataRepository.readManyByPattern(
      idPattern,
    );

    return dataCached;
  }

  public async loadAllDataToCache(user: IUserTokenDto) {
    await this.loadTotalValuesToCache(user);

    await this.loadClicksToCache(user);

    await this.loadLinksToCache(user);

    await this.loadGroupsToCache(user);
  }

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

  public async dashboard(user: IUserTokenDto) {
    try {
      const userModel = await this.usersRepository.findById(user.id);
      const totalLinks = await this.linksRepository.findAllByUser(userModel);
      const infosDate = await this.linksRepository.findAllLinkInfosByDate(
        new Date(Date.now()),
        userModel,
      );
      const infosMonth = await this.linksRepository.findAllLinkInfosByMonth(
        new Date(Date.now()),
        userModel,
      );
      const infosWeek = await this.linksRepository.findAllLinkInfosByWeek(
        new Date(Date.now()),
        userModel,
      );
      const data = {
        total_links: totalLinks.length,
        total_days_clicks: infosDate.length,
        infosWeek,
        infosMonth,
      };
      return data;
    } catch (error) {
      throw new BadRequestException(
        new Result('Error in transaction', false, {}, null),
      );
    }
  }
}
