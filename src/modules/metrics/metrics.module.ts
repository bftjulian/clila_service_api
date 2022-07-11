import { Registry } from 'prom-client';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import metricsConfig from './config/metrics.config';
import { MetricsService } from './services/metrics.service';
import { MetricsController } from './controllers/metrics.controller';
import { RegisteredMetrics } from './providers/registered-metrics.provider';
import { MetricsRepository } from './repositories/implementations/metrics.repository';

@Module({
  imports: [ConfigModule.forFeature(metricsConfig)],
  providers: [MetricsService, MetricsRepository, RegisteredMetrics, Registry],
  controllers: [MetricsController],
  exports: [MetricsRepository],
})
export class MetricsModule {}
