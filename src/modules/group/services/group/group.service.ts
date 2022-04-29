import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { IUserTokenDto } from 'src/modules/auth/dtos/user-token.dto';
import { Result } from 'src/shared/models/result';
import { CreateGroupDto } from '../../dtos/create-group.dto';
import { IGroupRepository } from '../../repositories/group-repository.interface';
import { GroupRepository } from '../../repositories/implementations/group.repository';

@Injectable()
export class GroupService {
  constructor(
    @Inject(GroupRepository)
    private readonly groupsRepository: IGroupRepository,
    private readonly i18n: I18nService,
  ) {}
  public async createGroup(
    user: IUserTokenDto,
    data: CreateGroupDto,
    lang: string,
  ) {
    try {
      await this.groupsRepository.create(data);
      return new Result(
        await this.i18n.translate('groups.SUCCESS_CREATE', {
          lang,
        }),
        true,
        null,
        null,
      );
    } catch (error) {
      throw new BadRequestException(
        new Result('Error in transaction', false, {}, null),
      );
    }
  }
}
