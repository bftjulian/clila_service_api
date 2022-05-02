import { FeedHashesDatabase } from './hashes.processor';
import { ImportHashesFromLinksProcessor } from './import-hashes-from-links.processor';

export const linksProcessors = [
  FeedHashesDatabase,
  ImportHashesFromLinksProcessor,
];
