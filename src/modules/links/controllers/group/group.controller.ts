import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { I18nLang } from 'nestjs-i18n';
import { IUserTokenDto } from 'src/modules/auth/dtos/user-token.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { QueryDto } from 'src/shared/dtos/query.dto';
import { CreateBatchLinksDto } from '../../dtos/create-batch-links-group.dto';
import { CreateGroupDto } from '../../dtos/create-group.dto';
import { CreateShortLinkListsDto } from '../../dtos/create-short-links-lists.dto';
import { MaliciousUrlInterceptor } from '../../interceptors/malicious-url.interceptor';
import { Group } from '../../models/groups.model';
import { GroupService } from '../../service/group/group.service';

@Controller('api/groups')
@ApiTags('Groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MaliciousUrlInterceptor)
  @Post()
  @ApiResponse({
    description: 'Create Group',
    type: Group,
    status: HttpStatus.CREATED,
  })
  public async groups(
    @Body() data: CreateGroupDto,
    @Req() request,
    @I18nLang() lang: string,
  ) {
    const user: IUserTokenDto = request.user;
    return await this.groupService.createGroup(user, data, lang);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Post('/:id/links/batch')
  @ApiResponse({
    description: 'Create links groups',
    type: Group,
    status: HttpStatus.CREATED,
  })
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
  @Post(':id/links/multiple')
  @ApiResponse({
    description: 'Create links groups',
    type: Group,
    status: HttpStatus.CREATED,
  })
  public async shortLinksMultiple(
    @Param() id_group,
    @Body() data: CreateShortLinkListsDto,
    @Req() request,
    @I18nLang() lang: string,
  ) {
    const user: IUserTokenDto = request.user;
    return await this.groupService.shortLinksMultiple(
      user,
      data,
      lang,
      id_group.id,
    );
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get('/:id/links')
  @ApiResponse({
    description: 'List links groups',
    type: Group,
    status: HttpStatus.OK,
  })
  public async listLinksGroups(
    @Param('id') id: string,
    @Query() query: QueryDto,
    @I18nLang() lang: string,
  ) {
    return await this.groupService.listLinksGroups(id, query, lang);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({
    description: 'List all groups',
    type: Group,
    status: HttpStatus.OK,
  })
  public async listGroups(
    @Req() request,
    @Query() query: QueryDto,
    @I18nLang() lang: string,
  ) {
    const user: IUserTokenDto = request.user;
    return await this.groupService.listGroups(query, lang, user.id);
  }
}
