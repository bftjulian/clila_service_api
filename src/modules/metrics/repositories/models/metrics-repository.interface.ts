import { Histogram, Counter, Gauge, Metric } from 'prom-client';
import { IGaugeConfiguration } from './gauge-configuration.interface';
import { ICounterConfiguration } from './counter-configuration.interface';
import { IHistogramConfiguration } from './histogram-configuration.interface';

export interface IMetricsRepository {
    createGauge(configuration: IGaugeConfiguration): Gauge<string>;
    createCounter(configuration: ICounterConfiguration): Counter<string>;
    createHistogram(configuration: IHistogramConfiguration): Histogram<string>;
    read(name: string): Metric<string>;
    delete(name: string): void;
    readAll(): Promise<string>;
    deleteAll(): void;
}
