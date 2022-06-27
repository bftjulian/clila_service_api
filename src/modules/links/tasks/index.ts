import { CheckMaliciousLinksFailedTask } from './check-malicious-links-faileds.task';
import { CheckThatLinksAreNoLongerMalicious } from './check-that-links-are-no-longer-malicious.task';
import { ExpireMaliciousLinksTask } from './expire-malicious-links.task';
import { FeedHashesTask } from './feed-hashes.task';
import { ImportHashFromLinksTask } from './import-hash-from-links.task';
import { InactiveLinkExpiredTask } from './inactive-links-expired.task';
import { LoadHashesOnRedisTask } from './load-hashes-on-redis.task';
import { ReleaseUnusedHashesTask } from './release-unused-hashes.task';
import { SearchForMaliciousLinksOnDatabase } from './search-for-malicious-links-on-database.task';

export const linksTasks = [
  FeedHashesTask,
  LoadHashesOnRedisTask,
  InactiveLinkExpiredTask,
  ImportHashFromLinksTask,
  ExpireMaliciousLinksTask,
  CheckMaliciousLinksFailedTask,
  SearchForMaliciousLinksOnDatabase,
  CheckThatLinksAreNoLongerMalicious,
  ReleaseUnusedHashesTask,
];
