import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { IUserTokenDto } from 'src/modules/auth/dtos/user-token.dto';
import { Result } from 'src/shared/models/result';
import RedisProvider from 'src/shared/providers/RedisProvider/implementations/RedisProvider';
import { CreateBatchLinksDto } from '../../dtos/create-batch-links-group.dto';
import { CreateGroupDto } from '../../dtos/create-group.dto';
import {
  CREATE_LINKS_BATCH,
  FREE_SIX_DIGITS_HASHES_REDIS_KEY,
  LINKS_BATCH_PROCESSOR,
  LINK_CREATED_EVENT_NAME,
  USED_HASHES_TO_UPDATE_REDIS_KEY,
} from '../../links.constants';
import { IGroupRepository } from '../../repositories/group-repository.interface';
import { GroupRepository } from '../../repositories/implementations/group.repository';
import { LinkRepository } from '../../repositories/implementations/link.repository';
import crypto from 'crypto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bull';
import { JobOptions, Queue } from 'bull';

type JobConf = {
  name?: string | undefined;
  data: any;
  opts?: Omit<JobOptions, 'repeat'> | undefined;
};
@Injectable()
export class GroupService {
  constructor(
    @Inject(GroupRepository)
    private readonly groupsRepository: IGroupRepository,
    private readonly linksRepository: LinkRepository,
    private readonly redisProvider: RedisProvider,
    private readonly i18n: I18nService,
    private readonly eventEmiter: EventEmitter2,
    @InjectQueue(LINKS_BATCH_PROCESSOR)
    private readonly linksBatchQueue: Queue,
  ) {}
  public async createGroup(
    user: IUserTokenDto,
    data: CreateGroupDto,
    lang: string,
  ) {
    try {
      const group = await this.groupsRepository.create(data);
      return new Result(
        await this.i18n.translate('groups.SUCCESS_CREATE', {
          lang,
        }),
        true,
        group,
        null,
      );
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        new Result('Error in transaction', false, {}, null),
      );
    }
  }

  public async batchLinksCreate(
    user: IUserTokenDto,
    id: string,
    data: CreateBatchLinksDto,
    lang: string,
  ) {
    const group = await this.groupsRepository.findById(id);
    if (!group) {
      throw new BadRequestException();
    }

    const hashes = await this.redisProvider.popMany(
      FREE_SIX_DIGITS_HASHES_REDIS_KEY,
      data.count - 1,
    );

    await this.redisProvider.lpush(USED_HASHES_TO_UPDATE_REDIS_KEY, hashes);

    this.eventEmiter.emit(LINK_CREATED_EVENT_NAME);

    let link: string;

    if (process.env.NODE_ENV === 'DEV') {
      link = 'http://localhost:3000/';
    } else {
      link = 'https://cli.la/';
    }

    const factory = (hash: string) => {
      return {
        hash_link: hash,
        original_link: group.original_link,
        short_link: link + hash,
        group: group,
      };
    };

    const queueInfo = await this.linksBatchQueue.getJobCounts();

    console.log(queueInfo);

    const batchLinkInsertRate = +process.env.BATCH_LINKS_RATE;

    const linksToInsertDatabase = hashes.map(factory);

    const insertRate = Math.ceil(
      linksToInsertDatabase.length / batchLinkInsertRate,
    );

    const linksToQueue = Array.from(Array(insertRate).keys()).map(() => {
      return {
        name: CREATE_LINKS_BATCH,
        data: {
          links: linksToInsertDatabase.splice(
            0,
            batchLinkInsertRate <= linksToInsertDatabase.length
              ? batchLinkInsertRate
              : linksToInsertDatabase.length,
          ),
        },
        opts: {
          delay: 10 * 1000,
        },
      } as JobConf;
    });

    await this.linksBatchQueue.addBulk(linksToQueue);

    const links = hashes.map((hash) => link + hash);
    return links;
    // const links = hashes.map(factory);

    // const createdLinks = await this.linksRepository.createMany(links);
    // return createdLinks.map((item) => item.short_link);

    // }
  }
}
