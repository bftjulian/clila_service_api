import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { MetricsRepository } from '../repositories/implementations/metrics.repository';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(private metricsRepository: MetricsRepository) {}

  use(req: Request, res: Response, next: NextFunction) {
    const httpData = {
      method: req.method,
      statusCode: res.statusCode,
      path: req.url,
      metric: 'custom',
    };

    this.metricsRepository
      .createCounter({
        name: 'http_requests_total',
        help: 'Total number of HTTP requests',
        labelNames: ['metric'],
      })
      .inc({ metric: 'custom' });

    this.metricsRepository
      .createCounter({
        name: 'http_requests',
        help: 'HTTP requests',
        labelNames: ['method', 'statusCode', 'path', 'metric'],
      })
      .inc(httpData);

    next();
  }
}
