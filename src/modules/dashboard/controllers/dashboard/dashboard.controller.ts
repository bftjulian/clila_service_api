import { I18nLang } from 'nestjs-i18n';
import { ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { IUserTokenDto } from '../../../auth/dtos/user-token.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { DashboardService } from '../../services/dashboard/dashboard.service';

@ApiTags('Dashboard')
@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get()
  public async loadUserDataToCache(@Req() request) {
    const user: IUserTokenDto = request.user;

    await this.dashboardService.handleConnection(user);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get('clicks')
  public async clicks(@Req() request) {
    const user: IUserTokenDto = request.user;
    return this.dashboardService.loadClicksToCache(user);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get('links')
  public async links(@Req() request) {
    const user: IUserTokenDto = request.user;
    return this.dashboardService.loadLinksToCache(user);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get('groups')
  public async groups(@Req() request) {
    const user: IUserTokenDto = request.user;
    return this.dashboardService.loadGroupsToCache(user);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get('old')
  public async dashboard(@Req() request, @I18nLang() lang: string) {
    const user: IUserTokenDto = request.user;
    return await this.dashboardService.dashboard(user);
  }
}
