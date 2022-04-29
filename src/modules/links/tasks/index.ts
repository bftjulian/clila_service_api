import { FeedHashesTask } from './feed-hashes.task';
import { InactiveLinkExpiredTask } from './inactive-links-expired.task';
import { LoadHashesOnRedisTask } from './load-hashes-on-redis.task';

export const linksTasks = [
  FeedHashesTask,
  LoadHashesOnRedisTask,
  InactiveLinkExpiredTask,
];
