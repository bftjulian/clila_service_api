import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { I18nLang } from 'nestjs-i18n';
import { IUserTokenDto } from 'src/modules/auth/dtos/user-token.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { DashboardService } from '../../services/dashboard/dashboard.service';

@Controller('api/dashboard')
@ApiTags('Dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get()
  public async dashboard(@Req() request, @I18nLang() lang: string) {
    const user: IUserTokenDto = request.user;
    return await this.dashboardService.dashboard(user);
  }
}
