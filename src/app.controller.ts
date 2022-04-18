import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { RealIP } from 'nestjs-real-ip';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Redirect')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public async redirectToSite(@Res() res) {
    return res.redirect('https://site.cli.la');
  }

  @Get(':hash')
  public async redirectOriginalLink(
    @Param('hash') hash: string,
    @Res() res,
    @RealIP() ip: string,
  ) {
    return await this.appService.redirectOriginalLink(hash, res, ip);
  }
}
