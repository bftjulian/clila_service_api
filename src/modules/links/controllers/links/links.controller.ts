import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { I18nLang } from 'nestjs-i18n';
import { IUserTokenDto } from 'src/modules/auth/dtos/user-token.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { CreateLinkDto } from '../../dtos/create-link.dto';
import { LinksService } from '../../service/links/links.service';

@Controller('links')
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
    // const u
    return await this.linksService.create(data, user, lang);
  }
}
