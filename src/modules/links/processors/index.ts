import { CreateLinkBatch } from './create-link-batch.processor';
import { CreateShortLinkMultiple } from './create-short-link-multiple.processor';
import { FeedHashesDatabase } from './hashes.processor';
import { ImportHashesFromLinksProcessor } from './import-hashes-from-links.processor';

export const linksProcessors = [
  FeedHashesDatabase,
  ImportHashesFromLinksProcessor,
  CreateLinkBatch,
  CreateShortLinkMultiple,
];
