import { Body, Controller, Post } from '@nestjs/common';
import { LinksService } from '../../service/links/links.service';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  public async create(@Body() data) {
    return await this.linksService.create(data);
  }
}
