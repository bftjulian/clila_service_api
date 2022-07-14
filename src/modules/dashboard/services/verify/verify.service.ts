import { verify } from 'jsonwebtoken';
import { isJWT } from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { Handshake } from 'socket.io/dist/socket.d';
import { jwtConstants } from '../../../auth/constants';
import { IUserTokenDto } from '../../../auth/dtos/user-token.dto';
import { IUserRepository } from 'src/modules/users/repositories/user-repository.interface';
import { UserRepository } from '../../../users/repositories/implementation/user.repository';
import { ICacheDataRepository } from '../../repositories/interfaces/cache-data-repository.interface';
import { CacheDataRepository } from '../../repositories/implementations/cache-data.repository';
import { LoadService } from '../load/load.service';

@Injectable()
export class VerifyService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,

    @Inject(CacheDataRepository)
    private readonly cacheDataRepository: ICacheDataRepository,

    private readonly loadService: LoadService,
  ) {}

  public authenticateConnection(handshake: Handshake) {
    const token = handshake.headers.authorization.split(' ')[1];

    if (!token) return undefined;

    if (token && isJWT(token)) {
      try {
        const decoded: IUserTokenDto = verify(
          token,
          jwtConstants.secret,
        ) as IUserTokenDto;

        const user: IUserTokenDto = {
          id: decoded.id,
          email: decoded.email,
        };

        return user;
      } catch (err) {
        return undefined;
      }
    }

    const user = this.isUserVerified(token).then((user): IUserTokenDto => {
      return user;
    });

    if (!user) {
      return this.userRepository
        .findByApiToken(token)
        .then((user) => {
          const userTokenDto: IUserTokenDto = {
            id: user._id,
            email: user.email,
          };

          this.verifyUser(userTokenDto, token)
            .then((user) => {
              return user;
            })
            .catch(() => {
              return undefined;
            });
        })
        .catch(() => {
          return undefined;
        });
    }

    return user;
  }

  public async isUserVerified(token: string) {
    const cacheId = `dashboard:token:${token}`;

    const user = await this.cacheDataRepository.read(cacheId);

    return user;
  }

  public async verifyUser(user: IUserTokenDto, token: string) {
    const cacheId = `dashboard:token:${token}`;

    await this.cacheDataRepository.create(cacheId, user);

    return user;
  }

  public async isUserLocked(user: IUserTokenDto) {
    const userId = user.id;

    const cacheId = `dashboard:${userId}:lock`;

    const userInfo = await this.cacheDataRepository.read(cacheId);

    if (userInfo && userInfo.userId === userId && userInfo.lock === true)
      return true;

    return false;
  }

  public async lockUser(user: IUserTokenDto, apiToken: string) {
    const userId = user.id;

    const cacheId = `dashboard:${userId}:lock`;

    const now = new Date();

    const lastConnection = {
      lock: true,
      userId: userId,
      date: now.toISOString(),
    };

    await this.cacheDataRepository.create(cacheId, lastConnection);
  }

  public async isUserDataCached(user: IUserTokenDto) {
    const userId = user.id;

    const cacheId = `dashboard:${userId}:cache`;

    const userInfo = await this.cacheDataRepository.read(cacheId);

    if (userInfo && userInfo.userId === userId && userInfo.cache === true)
      return true;

    return false;
  }

  public async cacheUserData(user: IUserTokenDto) {
    const userId = user.id;

    const cacheId = `dashboard:${userId}:cache`;

    const now = new Date();

    const lastConnection = {
      cache: true,
      userId: userId,
      date: now.toISOString(),
    };

    await this.cacheDataRepository.create(cacheId, lastConnection);
  }

  public async handleConnection(user: IUserTokenDto) {
    if ((await this.isUserDataCached(user)) === true) {
      return;
    } else {
      await this.loadService.loadAllDataToCache(user);

      await this.cacheUserData(user);
    }
  }

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
}
