import {
  Gauge,
  Metric,
  Counter,
  Registry,
  Histogram,
  collectDefaultMetrics,
} from 'prom-client';
import { ConfigType } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import metricsConfig from '../../config/metrics.config';
import { IMetricsRepository } from '../models/metrics-repository.interface';
import { IGaugeConfiguration } from '../models/gauge-configuration.interface';
import { RegisteredMetrics } from '../../providers/registered-metrics.provider';
import { ICounterConfiguration } from '../models/counter-configuration.interface';
import { IHistogramConfiguration } from '../models/histogram-configuration.interface';

@Injectable()
export class MetricsRepository implements IMetricsRepository {
  constructor(
    private readonly registry: Registry,
    private readonly registeredMetrics: RegisteredMetrics,
    @Inject(metricsConfig.KEY)
    private readonly metricsConfigure: ConfigType<typeof metricsConfig>,
  ) {
    this.registeredMetrics.gauge = {};
    this.registeredMetrics.counter = {};
    this.registeredMetrics.histogram = {};

    this.registry = new Registry();

    this.registry.setDefaultLabels({
      metric: 'default',
    });

    collectDefaultMetrics({
      register: this.registry,
      prefix: this.metricsConfigure.metricsPrefix + '_',
    });
  }

  public createGauge(configuration: IGaugeConfiguration): Gauge<string> {
    configuration.name =
      this.metricsConfigure.metricsPrefix + '_' + configuration.name;

    if (this.registeredMetrics.gauge[configuration.name] === undefined) {
      const gauge = new Gauge(configuration);

      this.registeredMetrics.gauge[configuration.name] = gauge;

      this.registry.registerMetric(gauge);
    }

    return this.registeredMetrics.gauge[configuration.name];
  }

  public createCounter(configuration: ICounterConfiguration): Counter<string> {
    configuration.name =
      this.metricsConfigure.metricsPrefix + '_' + configuration.name;

    if (!this.registeredMetrics.counter[configuration.name]) {
      const counter = new Counter({
        name: configuration.name,
        help: configuration.help,
        labelNames: configuration.labelNames,
      });

      this.registeredMetrics.counter[configuration.name] = counter;

      this.registry.registerMetric(counter);
    }

    return this.registeredMetrics.counter[configuration.name];
  }

  public createHistogram(
    configuration: IHistogramConfiguration,
  ): Histogram<string> {
    configuration.name =
      this.metricsConfigure.metricsPrefix + '_' + configuration.name;

    if (this.registeredMetrics.histogram[configuration.name] === undefined) {
      const histogram = new Histogram(configuration);

      this.registeredMetrics.histogram[configuration.name] = histogram;

      this.registry.registerMetric(histogram);
    }

    return this.registeredMetrics.histogram[configuration.name];
  }

  public read(name: string): Metric<string> {
    return this.registry.getSingleMetric(name);
  }

  public delete(name: string): void {
    return this.registry.removeSingleMetric(name);
  }

  public readAll(): Promise<string> {
    return this.registry.metrics();
  }

  public deleteAll(): void {
    this.registry.resetMetrics();
    this.registry.clear();
  }
}
