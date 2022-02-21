import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { I18nLang } from 'nestjs-i18n';
import { IUserTokenDto } from 'src/modules/auth/dtos/user-token.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { CreateLinkDto } from '../../dtos/create-link.dto';
import { PaginationParamsDto } from '../../dtos/pagination-params.dto';
import { LinksService } from '../../service/links/links.service';

@Controller('api/links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @UseGuards(JwtAuthGuard)
  @Post('shorten')
  public async create(
    @Body() data: CreateLinkDto,
    @Req() request,
    @I18nLang() lang: string,
  ) {
    const user: IUserTokenDto = request.user;
    return await this.linksService.create(data, user, lang);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  public async listLinksUser(
    @Req() request,
    @Query() query: PaginationParamsDto,
  ) {
    const user: IUserTokenDto = request.user;
    return await this.linksService.listLinksUser(user, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async listLinkUser(@Req() request, @Param('id') id: string) {
    const user: IUserTokenDto = request.user;
    return await this.linksService.listLinkUser(id, user);
  }
}
