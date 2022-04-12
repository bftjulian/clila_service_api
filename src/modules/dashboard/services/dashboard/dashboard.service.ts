import { Inject, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { IUserTokenDto } from 'src/modules/auth/dtos/user-token.dto';
import { LinkRepository } from 'src/modules/links/repositories/implementations/link.repository';
import { ILinkRepository } from 'src/modules/links/repositories/link-repository.interface';
import { UserRepository } from 'src/modules/users/repositories/implementation/user.repository';
import { IUserRepository } from 'src/modules/users/repositories/user-repository.interface';

@Injectable()
export class DashboardService {
  constructor(
    @Inject(LinkRepository)
    private readonly linksRepository: ILinkRepository,
    @Inject(UserRepository)
    private readonly usersRepository: IUserRepository,
    private readonly i18n: I18nService,
  ) {}
  public async dashboard(user: IUserTokenDto) {
    const userModel = await this.usersRepository.findById(user.id);
    const totalLinks = await this.linksRepository.findAllByUser(
      userModel,
      0,
      0,
    );
    const infosDate = await this.linksRepository.findAllLinkInfosByDate(
      new Date(Date.now()),
      userModel,
    );
    const infosMonth = await this.linksRepository.findAllLinkInfosByMonth(
      new Date(Date.now()),
      userModel,
    );
    const data = {
      total_links: totalLinks.count,
      total_days_clicks: infosDate.length,
      infosMonth,
    };
    // console.log(infosMonth);
    return data;
  }
}
