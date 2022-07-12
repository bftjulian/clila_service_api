import { Controller, Get, UseGuards } from '@nestjs/common';
import { MetricsService } from '../services/metrics.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@Controller('/api/metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  metrics() {
    return this.metricsService.metrics;
  }
}
