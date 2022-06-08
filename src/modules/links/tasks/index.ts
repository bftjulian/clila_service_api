import { CheckMaliciousLinksFailedTask } from './check-malicious-links-faileds.task';
import { ExpireMaliciousLinksTask } from './expire-malicious-links.task';
import { FeedHashesTask } from './feed-hashes.task';
import { ImportHashFromLinksTask } from './import-hash-from-links.task';
import { InactiveLinkExpiredTask } from './inactive-links-expired.task';
import { LoadHashesOnRedisTask } from './load-hashes-on-redis.task';

export const linksTasks = [
  FeedHashesTask,
  LoadHashesOnRedisTask,
  InactiveLinkExpiredTask,
  ImportHashFromLinksTask,
  ExpireMaliciousLinksTask,
  CheckMaliciousLinksFailedTask,
];
