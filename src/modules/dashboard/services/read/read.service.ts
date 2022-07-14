import { Inject, Injectable } from '@nestjs/common';
import { IUserTokenDto } from '../../../auth/dtos/user-token.dto';
import { CacheDataRepository } from '../../repositories/implementations/cache-data.repository';

import { ICacheDataRepository } from '../../repositories/interfaces/cache-data-repository.interface';

@Injectable()
export class ReadService {
  constructor(
    @Inject(CacheDataRepository)
    private readonly cacheDataRepository: ICacheDataRepository,
  ) {}

  public async readAllDataFromCache(user: IUserTokenDto) {
    console.log(user);
  }

  public async readTotalData(
    user: IUserTokenDto,
    whichData: string,
  ): Promise<number> {
    const userId = user.id;

    const cacheId = `dashboard:${whichData}:${userId}:total`;

    const data = await this.cacheDataRepository.read(cacheId);

    if (!data) {
      await this.
    }

    return data;
  }

  public async readDataGrouped(user: IUserTokenDto, whichData: string) {
    const userId = user.id;

    const idPattern = `dashboard:${whichData}:${userId}:*`;

    const dataGrouped = await this.cacheDataRepository.readManyByPattern(
      idPattern,
    );

    return dataGrouped;
  }

  public async readClicksGrouped(user: IUserTokenDto) {
    const clicksGrouped = await this.readDataGrouped(user, 'clicks');

    return {
      title: 'Clicks',
      value: clicksGrouped,
    };
  }
}
