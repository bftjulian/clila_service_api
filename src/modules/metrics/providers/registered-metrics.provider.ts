import { Gauge, Counter, Histogram } from 'prom-client';

interface IMapGauge {
  [key: string]: Gauge<string>;
}

interface IMapCounter {
  [key: string]: Counter<string>;
}

interface IMapHistogram {
  [key: string]: Histogram<string>;
}

export class RegisteredMetrics {
  gauge: IMapGauge;
  counter: IMapCounter;
  histogram: IMapHistogram;
}
