import { Injectable } from '@nestjs/common';
import { MetricsRepository } from '../repositories/implementations/metrics.repository';

@Injectable()
export class MetricsService {
  constructor(private readonly metricsRepository: MetricsRepository) {}

  public get metrics() {
    return this.metricsRepository.readAll();
  }
}
