import { DisparoproInfoClicksWebhookProvider } from './InfoClicksWebhookProvider/implementations/disparopro-info-clicks-webhook.provider';
import { maliciousContentCheckProviders } from './MaliciousContentCheckProvider';
import RedisProvider from './RedisProvider/implementations/RedisProvider';

export const sharedProviders = [
  RedisProvider,
  DisparoproInfoClicksWebhookProvider,
  ...maliciousContentCheckProviders,
];
