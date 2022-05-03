import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { I18nLang } from 'nestjs-i18n';
import { IUserTokenDto } from 'src/modules/auth/dtos/user-token.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { CreateBatchLinksDto } from '../../dtos/create-batch-links-group.dto';
import { GroupService } from '../../service/group/group.service';

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

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Post('/:id/links/batch')
  public async batchLinksCreate(
    @Param('id') id: string,
    @Body() data: CreateBatchLinksDto,
    @Req() request,
    @I18nLang() lang: string,
  ) {
    const user: IUserTokenDto = request.user;
    return await this.groupService.batchLinksCreate(user, id, data, lang);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get('/:id/links')
  public async listLinksGroups(
    @Param('id') id: string,
    @Req() request,
    @I18nLang() lang: string,
  ) {
    const user: IUserTokenDto = request.user;
    return await this.groupService.listLinksGroups(user, id, lang);
  }
}
