import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { I18nLang } from 'nestjs-i18n';
import { IUserTokenDto } from 'src/modules/auth/dtos/user-token.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { CreateLinkDto } from '../../dtos/create-link.dto';
import { PaginationParamsDto } from '../../dtos/pagination-params.dto';
import { UpdateLinkDto } from '../../dtos/update-link.dto';
import { LinksService } from '../../service/links/links.service';
import { LinksInterceptor } from '../../shared/interceptors/links.interceptor';

@Controller('api/links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  /**
   * Required api token from authorization obtained from panel
   * Route used only in the panel service
   */
  @UseInterceptors(LinksInterceptor)
  @Get('token-api/list')
  public async listAllLinksApiToken(
    @Req() request,
    @I18nLang() lang: string,
    @Query() query: PaginationParamsDto,
  ) {
    const {
      headers: { authorization },
    } = request;
    const apiToken = authorization.split(' ')[1];
    return await this.linksService.listAllLinksApiToken(apiToken, lang, query);
  }

  /**
   * Required api token from authorization obtained from panel
   * Route used only in the panel service
   */
  @UseInterceptors(LinksInterceptor)
  @Post('token-api/shorten')
  public async createShortLinkApiToken(
    @Req() request,
    @I18nLang() lang: string,
    @Body() data: CreateLinkDto,
  ) {
    const {
      headers: { authorization },
    } = request;
    const apiToken = authorization.split(' ')[1];
    return await this.linksService.createShortLinkApiToken(
      data,
      apiToken,
      lang,
    );
  }

  @SkipThrottle()
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

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get()
  public async listLinksUser(
    @Req() request,
    @Query() query: PaginationParamsDto,
  ) {
    const user: IUserTokenDto = request.user;
    return await this.linksService.listLinksUser(user, query);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get('download')
  public async linksDownload(@Req() request) {
    const user: IUserTokenDto = request.user;
    return await this.linksService.downloadLinks(user);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async listLinkUser(@Req() request, @Param('id') id) {
    return await this.linksService.listLinkUser(id);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  public async updateLink(
    @Param('id') id,
    @Body() data: UpdateLinkDto,
    @I18nLang() lang: string,
  ) {
    return await this.linksService.updateLink(id, data, lang);
  }

  @Post('shorten/landpage')
  public async createShortLandpage(@Body() data: CreateLinkDto) {
    return await this.linksService.createShortLandpage(data);
  }
}
