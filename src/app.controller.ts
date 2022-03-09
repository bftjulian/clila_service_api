import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { RealIP } from 'nestjs-real-ip';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':hash')
  public async redirectOriginalLink(
    @Param('hash') hash: string,
    @Res() res,
    @RealIP() ip: string,
  ) {
    return await this.appService.redirectOriginalLink(hash, res, ip);
  }
}
