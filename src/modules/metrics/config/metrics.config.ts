import { registerAs } from '@nestjs/config';

export default registerAs('files', () => ({
  defaultLabel: process.env.DEFAULT_LABEL,
  metricsPrefix: process.env.METRICS_PREFIX,
}));
