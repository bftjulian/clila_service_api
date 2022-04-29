import { FeedHashesTask } from './feed-hashes.task';
import { LoadHashesOnRedisTask } from './load-hashes-on-redis.task';

export const linksTasks = [FeedHashesTask, LoadHashesOnRedisTask];
