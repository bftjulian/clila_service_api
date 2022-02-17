import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':hash')
  public async redirectOriginalLink(@Param('hash') hash: string, @Res() res) {
    return await this.appService.redirectOriginalLink(hash, res);
  }
}
