import InfoClicksWebhookProvider from './InfoClicksWebhookProvider/implementations/InfoClicksWebhookProvider';
import RedisProvider from './RedisProvider/implementations/RedisProvider';

export const sharedProviders = [RedisProvider, InfoClicksWebhookProvider];
