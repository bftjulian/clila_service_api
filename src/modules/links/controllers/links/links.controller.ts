import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
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
import { CreateLinkDto } from '../../dtos/create-link.dto';
import { UpdateLinkDto } from '../../dtos/update-link.dto';
import { Link } from '../../models/link.model';
import { LinksService } from '../../service/links/links.service';
import { QueryDto } from '../../../../shared/dtos/query.dto';
import { MaliciousUrlInterceptor } from '../../interceptors/malicious-url.interceptor';
// import { LinksInterceptor } from '../../../../shared/interceptors/links.interceptor';

@ApiTags('Links')
@Controller('api/links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MaliciousUrlInterceptor)
  @Post('shorten')
  @ApiResponse({
    description: 'shorten a link',
    type: Link,
    status: HttpStatus.OK,
  })
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
  @Get('group-refs')
  @ApiResponse({
    description: 'List all authenticated user links group refs',
    type: Link,
    status: HttpStatus.OK,
  })
  public async listAllGroupRefs(@Query() query: QueryDto, @Req() request) {
    const user: IUserTokenDto = request.user;

    return await this.linksService.listGroupRefs(user, query);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({
    description: 'List all authenticated user links',
    type: Link,
    status: HttpStatus.OK,
  })
  public async listLinksUser(@Req() request, @Query() query: QueryDto) {
    const user: IUserTokenDto = request.user;
    return await this.linksService.listLinksUser(user, query);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get('download')
  @ApiResponse({
    description: 'Download a list of links',
    type: Link,
    status: HttpStatus.OK,
  })
  public async linksDownload(@Req() request) {
    const user: IUserTokenDto = request.user;
    return await this.linksService.downloadLinks(user);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiResponse({
    description: 'List a specific link',
    type: Link,
    status: HttpStatus.OK,
  })
  public async listLinkUser(@Req() request, @Param('id') id) {
    return await this.linksService.listLinkUser(id);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiResponse({
    description: 'Make a link change',
    type: Link,
    status: HttpStatus.OK,
  })
  public async updateLink(
    @Param('id') id,
    @Body() data: UpdateLinkDto,
    @I18nLang() lang: string,
  ) {
    return await this.linksService.updateLink(id, data, lang);
  }

  @UseInterceptors(MaliciousUrlInterceptor)
  @Post('shorten/landpage')
  @ApiResponse({
    description: 'Shorten a link through the website',
    type: Link,
    status: HttpStatus.OK,
  })
  public async createShortLandpage(@Body() data: CreateLinkDto) {
    return await this.linksService.createShortLandpage(data);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/inactivate')
  @ApiResponse({
    description: 'Inactivate a specific link',
    type: Link,
    status: HttpStatus.OK,
  })
  public async inactivateLink(@Param() id, @I18nLang() lang: string) {
    return await this.linksService.inactivateLink(id.id, lang);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/activate')
  @ApiResponse({
    description: 'Activate a specific link',
    type: Link,
    status: HttpStatus.OK,
  })
  public async activateLink(@Param() id, @I18nLang() lang: string) {
    return await this.linksService.activateLink(id.id, lang);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiResponse({
    description: 'Remove a specific link',
    type: Link,
    status: HttpStatus.OK,
  })
  public async removeLink(@Param() id, @I18nLang() lang: string) {
    return await this.linksService.removeLink(id.id, lang);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get(':id/infos')
  @ApiResponse({
    description: 'Back information from a specific link',
    type: Link,
    status: HttpStatus.OK,
  })
  public async listLinksInfos(@Param() id) {
    return await this.linksService.listLinksInfos(id.id);
  }
}
