import {
  Injectable,
  CallHandler,
  NestInterceptor,
  ExecutionContext,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetricsRepository } from '../repositories/implementations/metrics.repository';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsRepository: MetricsRepository) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const httpData = {
      method: request.method,
      statusCode: response.statusCode,
      path: request.url,
      metric: 'custom',
    };

    const bucketsSize = [0.005, 0.01, 0.05, 0.1, 5, 15, 30, 60, 120];

    const httpRequestDurationSecondsTotal = this.metricsRepository
      .createHistogram({
        name: 'http_request_duration_seconds_total',
        help: 'Total duration of HTTP requests in seconds',
        labelNames: ['metric'],
        buckets: bucketsSize,
      })
      .startTimer({ metric: 'custom' });

    const httpRequestDurationSeconds = this.metricsRepository
      .createHistogram({
        name: 'http_request_duration_seconds',
        help: 'HTTP request duration in seconds',
        labelNames: ['method', 'statusCode', 'path', 'metric'],
        buckets: bucketsSize,
      })
      .startTimer(httpData);

    return next.handle().pipe(
      tap(() => {
        httpRequestDurationSecondsTotal();
        httpRequestDurationSeconds();
      }),
    );
  }
}
