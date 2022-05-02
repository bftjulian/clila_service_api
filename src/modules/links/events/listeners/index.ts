import { LinkCreatedListener } from './link-created.listener';
import { LoadHashesOnRedisListener } from './load-hashes-to-redis.listener';

export const linksEventListeners = [
  LinkCreatedListener,
  LoadHashesOnRedisListener,
];
