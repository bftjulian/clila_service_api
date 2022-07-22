import { verify } from 'jsonwebtoken';
import { isJWT } from 'class-validator';
import { LoadService } from '../load/load.service';
import { Inject, Injectable } from '@nestjs/common';
import { Handshake } from 'socket.io/dist/socket.d';
import { jwtConstants } from '../../../auth/constants';
import { IUserTokenDto } from '../../../auth/dtos/user-token.dto';
import { IUserRepository } from 'src/modules/users/repositories/user-repository.interface';
import { UserRepository } from '../../../users/repositories/implementation/user.repository';
import { CacheDataRepository } from '../../repositories/implementations/cache-data.repository';
import { ICacheDataRepository } from '../../repositories/interfaces/cache-data-repository.interface';

@Injectable()
export class VerifyService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,

    @Inject(CacheDataRepository)
    private readonly cacheDataRepository: ICacheDataRepository,

    private readonly loadService: LoadService,
  ) {}

  public async authenticateConnection(handshake: Handshake) {
    const authorization =
      handshake.headers.authorization ?? String(handshake.query.authorization);

    if (!authorization || authorization.length === 0) return undefined;

    const token = authorization.split(' ')[1];

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

    const user = await this.isUserVerified(token);

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

    const tokenInfo = await this.cacheDataRepository.read(cacheId);

    return tokenInfo.user;
  }

  public async verifyUser(user: IUserTokenDto, token: string) {
    const cacheId = `dashboard:token:${token}`;

    const tokenInfo = {
      user: user,
      token: token,
      date: new Date(),
    };

    await this.cacheDataRepository.create(cacheId, tokenInfo);

    await this.lockUser(user, token);

    return user;
  }

  public async isUserLocked(user: IUserTokenDto) {
    const userId = user.id;

    const cacheId = `dashboard:user:${userId}:lock`;

    const userInfo = await this.cacheDataRepository.read(cacheId);

    if (userInfo && userInfo.userId === userId && userInfo.lock === true)
      return true;

    return false;
  }

  public async lockUser(user: IUserTokenDto, apiToken: string) {
    const userId = user.id;

    const cacheId = `dashboard:user:${userId}:lock`;

    const now = new Date();

    const lastConnection = {
      lock: true,
      userId: userId,
      apiToken: apiToken,
      date: now.toISOString(),
    };

    await this.cacheDataRepository.create(cacheId, lastConnection);
  }

  public async isUserDataCached(user: IUserTokenDto) {
    const userId = user.id;

    const cacheId = `dashboard:user:${userId}:cache`;

    const userInfo = await this.cacheDataRepository.read(cacheId);

    if (userInfo && userInfo.userId === userId && userInfo.cache === true)
      return true;

    return false;
  }

  public async cacheUserData(user: IUserTokenDto) {
    const userId = user.id;

    const cacheId = `dashboard:user:${userId}:cache`;

    const now = new Date();

    const lastConnection = {
      cache: true,
      userId: userId,
      date: now.toISOString(),
    };

    await this.cacheDataRepository.create(cacheId, lastConnection);
  }

  public async userSocketInfo(
    user: IUserTokenDto,
    socketId,
    userChannel: string,
  ) {
    const cacheId = `dashboard:user:${user.id}:info`;

    await this.cacheDataRepository.create(cacheId, {
      user: user,
      socketId: socketId,
      userChannel: userChannel,
      date: new Date(),
    });
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

    const cacheId = `dashboard:user:${userId}:logout`;

    const lastLogout = {
      userId: userId,
      date: now.toISOString(),
    };

    await this.cacheDataRepository.create(cacheId, lastLogout);
  }
}
