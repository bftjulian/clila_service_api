import { Body, Controller, Post, Req } from '@nestjs/common';
import { IUserTokenDto } from 'src/modules/auth/dtos/user-token.dto';
import { CreateLinkDto } from '../../dtos/create-link.dto';
import { LinksService } from '../../service/links/links.service';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  public async create(@Body() data: CreateLinkDto, @Req() request) {
    const user: IUserTokenDto = request.user;
    return await this.linksService.create(data, user);
  }
}
