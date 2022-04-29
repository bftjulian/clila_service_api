import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { I18nLang } from 'nestjs-i18n';
import { IUserTokenDto } from 'src/modules/auth/dtos/user-token.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
<<<<<<< HEAD:src/modules/group/controllers/group/group.controller.ts
import { GroupService } from '../../services/group/group.service';
=======
import { CreateGroupDto } from '../../dtos/create-group.dto';
import { GroupService } from '../../service/group/group.service';
>>>>>>> b81df136a5bb05ba4e33462347fe06e489d699a2:src/modules/links/controllers/group/group.controller.ts

@Controller('api/groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  /**
   * Required api token from authorization obtained from panel
   * Route used only in the panel service
   */
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Post()
  public async groups(@Body() data, @Req() request, @I18nLang() lang: string) {
    const user: IUserTokenDto = request.user;
    return await this.groupService.createGroup(user, data, lang);
  }
}
