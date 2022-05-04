import { DisparoproInfoClicksWebhookProvider } from './InfoClicksWebhookProvider/implementations/disparopro-info-clicks-webhook.provider';
import RedisProvider from './RedisProvider/implementations/RedisProvider';

export const sharedProviders = [
  RedisProvider,
  DisparoproInfoClicksWebhookProvider,
];
