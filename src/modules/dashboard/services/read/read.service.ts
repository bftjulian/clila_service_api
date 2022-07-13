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
    const userId = user.id;

    const idPattern = `dashboard:*:${userId}:*`;

    const dataCached = await this.cacheDataRepository.readManyByPattern(
      idPattern,
    );

    return dataCached;
  }
}
