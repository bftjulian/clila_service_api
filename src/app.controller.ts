import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { RealIP } from 'nestjs-real-ip';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Redirect')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @SkipThrottle()
  public async redirectToSite(@Res() res) {
    return res.redirect('https://site.cli.la');
  }

  @SkipThrottle()
  @Get(':hash')
  public async redirectOriginalLink(
    @Param('hash') hash: string,
    @Res() res: Response,
    @RealIP() ip: string,
  ) {
    const domain = await this.appService.redirectOriginalLink(hash, ip);

    return res.redirect(domain);
  }
}
