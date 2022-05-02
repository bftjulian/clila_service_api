import { FeedHashesTask } from './feed-hashes.task';
import { ImportHashFromLinksTask } from './import-hash-from-links.task';
import { InactiveLinkExpiredTask } from './inactive-links-expired.task';
import { LoadHashesOnRedisTask } from './load-hashes-on-redis.task';

export const linksTasks = [
  FeedHashesTask,
  LoadHashesOnRedisTask,
  InactiveLinkExpiredTask,
  ImportHashFromLinksTask,
];
